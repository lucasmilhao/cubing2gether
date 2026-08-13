import { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./SolveChart.css";

interface Solve {
    id: number;
    tempo: number;
}

interface SolveChartProps {
    solves: Solve[];
}

type ChartData = {
    index: number;
    id: number;
    tempo: number;
};

export function SolveChart({ solves }: SolveChartProps) {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!svgRef.current || !solves.length) return;

        const svg = d3.select<SVGSVGElement, unknown>(svgRef.current);

        svg.selectAll("*").remove();

        const container = svgRef.current.parentElement;

        if (!container) return;

        const width = container.clientWidth;
        const height = 350;

        const margin = {
            top: 30,
            right: 30,
            bottom: 50,
            left: 60,
        };

        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        svg
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", `0 0 ${width} ${height}`);

        const data: ChartData[] = solves.map((solve, index) => ({
            index: index + 1,
            id: solve.id,
            tempo: solve.tempo / 1000,
        }));

        const minTempo = d3.min(data, d => d.tempo) ?? 0;
        const maxTempo = d3.max(data, d => d.tempo) ?? 10;

        const yPadding = Math.max((maxTempo - minTempo) * 0.15, 1);

        const x = d3
            .scaleLinear()
            .domain([1, Math.max(data.length, 2)])
            .range([0, chartWidth]);

        const y = d3
            .scaleLinear()
            .domain([
                Math.max(0, minTempo - yPadding),
                maxTempo + yPadding,
            ])
            .nice()
            .range([chartHeight, 0]);

        const chart = svg
            .append<SVGGElement>("g")
            .attr(
                "transform",
                `translate(${margin.left},${margin.top})`
            );

        /*
         * GRID HORIZONTAL
         */
        chart
            .append<SVGGElement>("g")
            .attr("class", "chart-grid")
            .call(
                d3
                    .axisLeft(y)
                    .ticks(6)
                    .tickSize(-chartWidth)
                    .tickFormat(() => "")
            );

        /*
         * EIXO X
         */
        chart
            .append<SVGGElement>("g")
            .attr("class", "chart-axis chart-axis-x")
            .attr("transform", `translate(0,${chartHeight})`)
            .call(
                d3
                    .axisBottom(x)
                    .ticks(Math.min(data.length, 10))
                    .tickFormat(d => `${d}`)
            );

        /*
         * EIXO Y
         */
        chart
            .append<SVGGElement>("g")
            .attr("class", "chart-axis")
            .call(
                d3
                    .axisLeft(y)
                    .ticks(6)
                    .tickFormat(d => `${Number(d).toFixed(1)}s`)
            );

        /*
         * LABEL DO EIXO X
         */
        chart
            .append<SVGTextElement>("text")
            .attr("class", "chart-label")
            .attr("x", chartWidth / 2)
            .attr("y", chartHeight + 42)
            .attr("text-anchor", "middle")
            .text("Resolução");

        /*
         * LABEL DO EIXO Y
         */
        chart
            .append<SVGTextElement>("text")
            .attr("class", "chart-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -chartHeight / 2)
            .attr("y", -42)
            .attr("text-anchor", "middle")
            .text("Tempo");

        /*
         * LINHA
         */
        const line = d3
            .line<ChartData>()
            .x(d => x(d.index))
            .y(d => y(d.tempo))
            .curve(d3.curveMonotoneX);

        chart
            .append<SVGPathElement>("path")
            .datum(data)
            .attr("class", "solve-line")
            .attr("d", line);

        /*
         * ÁREA ABAIXO DA LINHA
         */
        const area = d3
            .area<ChartData>()
            .x(d => x(d.index))
            .y0(chartHeight)
            .y1(d => y(d.tempo))
            .curve(d3.curveMonotoneX);

        chart
            .append<SVGPathElement>("path")
            .datum(data)
            .attr("class", "solve-area")
            .attr("d", area);

        /*
         * TOOLTIP
         */
        const tooltip = d3
            .select(container)
            .append<HTMLDivElement>("div")
            .attr("class", "solve-tooltip")
            .style("opacity", 0);

        /*
         * PONTOS
         */
        chart
            .selectAll<SVGCircleElement, ChartData>(".solve-point")
            .data(data)
            .enter()
            .append<SVGCircleElement>("circle")
            .attr("class", "solve-point")
            .attr("cx", d => x(d.index))
            .attr("cy", d => y(d.tempo))
            .attr("r", 6)
            .on("mouseenter", function (event, d) {
                d3.select(this)
                    .transition()
                    .duration(150)
                    .attr("r", 8);

                tooltip
                    .style("opacity", 1)
                    .html(
                        `
                        <strong>Resolução #${d.index}</strong>
                        <br />
                        ${d.tempo.toFixed(2)}s
                        `
                    )
                    .style("left", `${event.offsetX + 12}px`)
                    .style("top", `${event.offsetY - 45}px`);
            })
            .on("mouseleave", function () {
                d3.select(this)
                    .transition()
                    .duration(150)
                    .attr("r", 6);

                tooltip.style("opacity", 0);
            });

        /*
         * REDIMENSIONAMENTO
         */
        const resizeObserver = new ResizeObserver(() => {
            if (!svgRef.current) return;
        
            const newWidth =
                svgRef.current.parentElement?.clientWidth;
        
            if (!newWidth) return;
        
            svg
                .attr("width", newWidth)
                .attr(
                    "viewBox",
                    `0 0 ${newWidth} ${height}`
                );
        
            const newChartWidth =
                newWidth - margin.left - margin.right;
        
            x.range([0, newChartWidth]);
        
            chart
                .select<SVGGElement>(".chart-grid")
                .call(
                    d3
                        .axisLeft(y)
                        .ticks(6)
                        .tickSize(-newChartWidth)
                        .tickFormat(() => "")
                );
        
            chart
                .select<SVGGElement>(".chart-axis-x")
                .call(
                    d3
                        .axisBottom(x)
                        .ticks(Math.min(data.length, 10))
                        .tickFormat(d => `${d}`)
                );
        
            chart
                .select<SVGPathElement>(".solve-line")
                .datum(data)
                .attr("d", line);
        
            chart
                .select<SVGPathElement>(".solve-area")
                .datum(data)
                .attr("d", area);
        
            chart
                .selectAll<SVGCircleElement, ChartData>(".solve-point")
                .attr("cx", d => x(d.index));
        });

        resizeObserver.observe(container);

        return () => {
            resizeObserver.disconnect();
            tooltip.remove();
        };
    }, [solves]);

    return (
        <div className="solve-chart-container">
            <svg ref={svgRef} />
        </div>
    );
}

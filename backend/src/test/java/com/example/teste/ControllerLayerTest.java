package com.example.teste;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.teste.controller.AuthController;
import com.example.teste.controller.NotificacaoController;
import com.example.teste.service.AuthService;
import com.example.teste.service.NotificacaoService;

class ControllerLayerTest {

    @Test
    void everyBackendControllerIsARegisteredRestControllerWithBaseRoute() {
        for (Class<?> controllerType : ControllerInventory.CONTROLLERS) {
            assertNotNull(controllerType.getAnnotation(RestController.class), controllerType.getSimpleName());
            assertNotNull(controllerType.getAnnotation(RequestMapping.class), controllerType.getSimpleName());
        }
    }

    @Test
    void logoutClearsAccessTokenAndReturnsNoContent() {
        AuthController controller = new AuthController();
        ReflectionTestUtils.setField(controller, "service", mock(AuthService.class));
        MockHttpServletResponse response = new MockHttpServletResponse();

        var result = controller.logout(response);

        assertEquals(HttpStatus.NO_CONTENT, result.getStatusCode());
        assertNotNull(response.getHeader("Set-Cookie"));
        assertEquals(0, response.getCookie("access_token").getMaxAge());
    }

    @Test
    void notificationReadEndpointsDelegateAndReturnNoContent() {
        NotificacaoService service = mock(NotificacaoService.class);
        NotificacaoController controller = new NotificacaoController();
        ReflectionTestUtils.setField(controller, "service", service);

        assertEquals(HttpStatus.NO_CONTENT, controller.setNotificacaoLida("notification-id").getStatusCode());
        assertEquals(HttpStatus.NO_CONTENT, controller.setNotificacoesLidas(null).getStatusCode());

        verify(service).setNotificacaoLida("notification-id");
        verify(service).setNotificacoesLidas(null);
    }
}
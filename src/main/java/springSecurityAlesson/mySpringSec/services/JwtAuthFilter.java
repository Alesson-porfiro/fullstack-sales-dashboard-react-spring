package springSecurityAlesson.mySpringSec.services;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;


    //Esse metodo é chamado automaticamente pelo Spring em cada requisição
    //Ele decide se a requisição pode seguir em frente ou não.
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException{
        //Lê o header Authorization da requisição
        final String authHeader = request.getHeader("Authorization");
        //Verifica se começa com "Bearer" (formato padrão do JWT: Bearer <token>)
        final String prefix = "Bearer";

        //Se não tiver autorização não faz nada e deixa a requisição seguir sem autenticação.
        if (authHeader == null || !authHeader.startsWith(prefix)){
            chain.doFilter(request, response);
            return;
        }

        //Extrair token e username
        final String token = authHeader.substring(prefix.length());
        final String username = jwtService.extractUsername(token);

        //Validar se o usuário está autenticado
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            var userDetails = userDetailsService.loadUserByUsername(username);

            //Validar o token
            if (jwtService.isTokenValid(token, userDetails.getUsername())) {
                var authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        chain.doFilter(request, response);
    }
}

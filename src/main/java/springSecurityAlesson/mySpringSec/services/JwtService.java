package springSecurityAlesson.mySpringSec.services;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    //Atributos principais
    private final Key signingKey;
    private final long expirationMs;

    //Construtor
    public JwtService(
            @Value("${app.security.jwt.secret}") String secret,
            @Value("${app.security.jwt.expiration-ms}") long expirationMs
    ){
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes());
        this.expirationMs = expirationMs;
    }

    //Gerar token
    public String generateToken(String username, Map<String, Object> extraClaims) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setClaims(extraClaims)     // infos extras (roles, id, etc)
                .setSubject(username)       // identifica o dono do token
                .setIssuedAt(new Date(now))    // quando foi emitido
                .setExpiration(new Date(now + expirationMs))   // quando expira
                .signWith(signingKey, SignatureAlgorithm.HS256)    // assina o token
                .compact();
    }

    //Extrair dados do token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    //Retorna o username que está no subject do token.
    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        final Claims claims = Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return resolver.apply(claims);
    }

    //Validar token
    public boolean isTokenValid(String token, String username) {
        try {
            String subject = extractUsername(token);
            return subject.equals(username) && !isTokenExpired(token);
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    //Checar expiração
    private boolean isTokenExpired(String token) {
        Date exp = extractClaim(token, Claims::getExpiration);
        return exp.before(new Date());
    }
}

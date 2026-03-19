package com.Jagdev.QuizApp.Security;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import org.springframework.security.core.Authentication;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenProvider {




    private static final int JWT_EXPIRATION_MS=3600000;
    private static final String JWT_SECRET="QuizAppJwtSecretKeyAtLeastThirtyTwoCharsLong";
    private SecretKey getSigningKey(){
        return Keys.hmacShaKeyFor(JWT_SECRET.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(Authentication authentication){
        String email=authentication.getName();
        Date currentDate=new Date();
        Date expirationDate=new Date(currentDate.getTime() + JWT_EXPIRATION_MS);
        String token= Jwts.builder()
                .subject(email)
                .issuedAt(currentDate)
                .expiration(expirationDate)
            .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
        return token;

    }

    public String getEamilFromToken(String token){
        Claims claims=Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token).getPayload();
        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        }catch (Exception e){
            return false;
        }
    }
}

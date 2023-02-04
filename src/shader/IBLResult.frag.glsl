#version 300 es
precision mediump float;

uniform sampler2D resultTex;
uniform samplerCube envCube;

uniform sampler2D probTex;
uniform sampler2D marginalProbTex;

uniform float renderWithIBL;
uniform float gamma;
uniform float exposure;
uniform float aspect;
uniform mat4 envRotMatrix;

in vec2 texCoord;

out vec4 fragColor;

vec3 sampleEnvMap( vec3 rsReflVector )
{
    return texture( envCube, rsReflVector ).rgb;
}


void main()
{
    vec4 tex = texture( resultTex, texCoord );

    if( tex.a < 0.25 )
    {
        if( renderWithIBL > 0.5 )
        {
            vec2 texCoord = texCoord.xy;
            texCoord = (texCoord) * 2.0 - vec2(1.0);
            texCoord.x *= aspect;

            vec3 dir = normalize( vec3(texCoord.x,texCoord.y, -1.0) );
            tex = vec4( sampleEnvMap( (envRotMatrix * vec4(dir,0)).xyz ), 1.0 );
        }
        else tex = vec4(.1,.1,.1,1);
    }

    // divide by the number of samples comped into this result
    tex /= tex.a;

    // exposure
    tex.rgb *= pow( 2.0, exposure );

    // gamma
    tex.rgb = pow( tex.rgb, vec3( 1.0 / gamma ) );

    fragColor = vec4( tex.rgb, 1.0 );
}


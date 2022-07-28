

attribute float angle;
attribute float size;
attribute float opacity;
attribute vec3 color;
attribute float visible;

varying float v_Angle;
varying float v_Opacity;
varying vec3 v_Color;
varying vec3 v_startPos;

attribute vec3 startPos;
uniform float density;//更改粒子消失比例
varying float v_visibleNum;

float random(in vec2 st){
    return fract(sin(dot(st.xy,
                vec2(12.9898,78.233)))
            *43758.5453123);
        }
        
        float noise(in vec2 st){
            vec2 i=floor(st);
            vec2 f=fract(st);
            
            // Four corners in 2D of a tile
            float a=random(i);
            float b=random(i+vec2(1.,0.));
            float c=random(i+vec2(0.,1.));
            float d=random(i+vec2(1.,1.));
            
            // Smooth Interpolation
            
            // Cubic Hermine Curve.  Same as SmoothStep()
            vec2 u=f*f*(3.-2.*f);
            // u = smoothstep(0.,1.,f);
            
            // Mix 4 coorners percentages
            return mix(a,b,u.x)+
            (c-a)*u.y*(1.-u.x)+
            (d-b)*u.x*u.y;
        }
        
        void main(){
            v_startPos=startPos;
            vec3 noisemap=vec3(noise(startPos.xz));
            float visibleNum=smoothstep(density,density+.001,noisemap.r);
            v_visibleNum=visibleNum;
            
            v_Angle=angle;
            v_Opacity=opacity;
            if(visible>.5){
                v_Color=color;
            }else{
                v_Color=vec3(0.);
                v_Opacity=0.;
            }
            vec4 ppos=modelViewMatrix*vec4(position,1.);
            gl_Position=projectionMatrix*ppos;
            gl_PointSize=size*(300./length(ppos.xyz));
        }
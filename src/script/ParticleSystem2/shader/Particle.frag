uniform sampler2D maps;
varying float v_Angle;
varying float v_Opacity;
varying vec3 v_Color;


varying float v_visibleNum;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
    sin(_angle),cos(_angle));
}

void main(){
    
    vec4 Colors=vec4(v_Color,v_Opacity);

    vec2 uvs=vec2(gl_PointCoord.x,gl_PointCoord.y);
    uvs-=.5;
    uvs=rotate2d(v_Angle)*uvs;
    
    vec4 textures=texture2D(maps,uvs+.5);
    
    gl_FragColor=Colors*textures;
    gl_FragColor.a=min(gl_FragColor.a,v_visibleNum);
}
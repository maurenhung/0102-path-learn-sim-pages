import{r as d}from"./vendor-C6MCS626.js";import{u as _}from"./useWebGPUParticles-C1G7VtFA.js";const k=`struct Particle {
    positionSizeAlpha : vec4<f32>,
    color             : vec4<f32>,
    flags             : vec4<f32>,
};

struct Uniforms {
    resolution : vec2<f32>,
    _pad       : vec2<f32>,
};

@group(0) @binding(0) var<storage, read> particles : array<Particle>;
@group(0) @binding(1) var<uniform> uniforms : Uniforms;

struct VOut {
    @builtin(position) pos : vec4<f32>,
    @location(0) uv : vec2<f32>,
    @location(1) color : vec4<f32>,
    @location(2) alpha : f32,
};

var<private> quad : array<vec2<f32>, 6> = array<vec2<f32>, 6>(
    vec2<f32>(-1.0, -1.0), vec2<f32>( 1.0, -1.0), vec2<f32>(-1.0,  1.0),
    vec2<f32>(-1.0,  1.0), vec2<f32>( 1.0, -1.0), vec2<f32>( 1.0,  1.0),
);

@vertex
fn vs_main(
    @builtin(vertex_index) vertexIndex : u32,
    @builtin(instance_index) instanceIndex : u32,
) -> VOut {
    let p = particles[instanceIndex];
    let local = quad[vertexIndex];
    let position = p.positionSizeAlpha.xy;
    let size = p.positionSizeAlpha.z;
    let alpha = p.positionSizeAlpha.w;
    let radius = size * 0.5;
    let world = position + local * radius;

    var out : VOut;
    out.pos = vec4<f32>(
        world.x / uniforms.resolution.x * 2.0 - 1.0,
       -(world.y / uniforms.resolution.y * 2.0 - 1.0),
        0.0,
        1.0,
    );
    out.uv = local;
    out.color = p.color;
    out.alpha = alpha;
    return out;
}

@fragment
fn fs_main(in : VOut) -> @location(0) vec4<f32> {
    let d = length(in.uv);
    if (d > 1.0) { discard; }

    let fillEdge = smoothstep(0.98, 0.78, d);
    let stroke = smoothstep(0.98, 0.90, d) - smoothstep(0.90, 0.78, d);

    let fillAlpha = in.alpha * fillEdge;
    let strokeAlpha = 0.25 * stroke * in.alpha;
    let color = in.color.rgb * fillAlpha;
    let alpha = min(1.0, fillAlpha + strokeAlpha);

    return vec4<f32>(color, alpha);
}
`,b=12,v=b*4;function E(r){if(typeof r!="string")return[1,1,1,1];const n=r.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/i);if(n)return[Number(n[1])/255,Number(n[2])/255,Number(n[3])/255,n[4]!==void 0?Number(n[4]):1];const l=r.startsWith("#")?r.slice(1):r,a=l.length===3?l.split("").map(o=>o+o).join(""):l,s=Number.parseInt(a,16);return Number.isFinite(s)?[(s>>16&255)/255,(s>>8&255)/255,(s&255)/255,1]:[1,1,1,1]}function C(r,n=2e3){const l=d.useMemo(()=>({label:"stain-particles",maxParticles:n,particleByteSize:v,renderShader:k,uniformBufferSize:16}),[n]),{ready:a,supported:s,updateParticles:o,render:c}=_(r,{config:l}),g=d.useCallback((u,y,x)=>{if(!a)return!1;const p=Math.min(u.length,n),h=new ArrayBuffer(p*v),e=new Float32Array(h);for(let f=0;f<p;f++){const i=u[f],t=f*b,[z,S,w,m]=E(i.color),I=(i.opacity??(i.isDisplaced?.8:i.inPore?.6:1))*m;e[t+0]=i.x??0,e[t+1]=i.y??0,e[t+2]=i.size??6,e[t+3]=I,e[t+4]=z,e[t+5]=S,e[t+6]=w,e[t+7]=m,e[t+8]=0}return o(h,p),c(y,x)},[a,c,o,n]),A=d.useCallback(()=>{if(!a)return;const u=new Uint8Array(n*v);o(u.buffer,0),c(1,1)},[a,c,o,n]);return{renderParticles:g,clear:A,supported:s}}export{C as u};

export default function createProgram(gl, vertSrc, fragSrc, uniformNames, attributeNames) {
  const vert = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
  const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);

  const program = gl.createProgram();
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);

  const attributes = {};
  attributeNames.forEach((name, location) => {
    gl.bindAttribLocation(program, location, name);
    console.log('attribute location', name, location);
    attributes[name] = location;
  });

  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error('Error linking program: ' + gl.getProgramInfoLog(program));
  }

  var uniforms = {};
  uniformNames.forEach((name) => {
    var location = gl.getUniformLocation(program, name);
    console.log('uniform location', name, location);
    uniforms[name] = location;
  });

  return {
    program: program,
    uniforms: uniforms,
    attributes: attributes
  };
}

function compileShader(gl, type, src) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error('Error compiling shader: ' + gl.getShaderInfoLog(shader));
  }
  return shader;
}

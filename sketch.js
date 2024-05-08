
let loading = false; 
let cam;
let processed_img = null;

 function preload(){
 }
var index = 0

function mousePressed()
{

     console.log("mousePressed")
     loading = true;
     processed_img = null;
     loading = true;
     api_url = 'http://3.149.240.150/wsgi'

     w = 1024
     h = 768

     console.log("cam: " + cam.width + "," + cam.height)
     console.log("w: " + w + " h: " + h )
     //var img = createImage(w,h);
     //img.loadPixels();
     //img.copy(cam, 0, 0, w, h, 0, 0, w, h);

    var videoWidth = cam.width
    var videoHeight = cam.height 

    var canvas = $('canvas')[0];
    var desiredWidth = 256
    var desiredHeight = 192
    var offscreen_canvas = document.createElement('canvas');
    offscreen_canvas.width = desiredWidth;
    offscreen_canvas.height = desiredHeight;
    offscreen_canvas.getContext('2d').drawImage(canvas,0,0,256,192,0,0,256,192);
    result = canvas.toDataURL()
    
    var canvas_img = canvas.toDataURL('image/jpeg'); 

    var payload = offscreen_canvas.toDataURL('image/png').replace(/data:image\/png;base64,/, '');

    var data = new FormData();
    data.append( "json", JSON.stringify( payload ) );

	console.log("payload: " + data);
	for (var p of data) {
	    let name = p[0];
	    let value = p[1];

	    console.log(name, value)
	}

     fetch("http://3.149.240.150/wsgi",
     {
	method: "POST",
        body: data
     }).then((response) => { processed_img = loadImage("result_images/result.png"); loading = false; });

}

 function setup() {
   // shaders require WEBGL mode to work
   createCanvas(512,192, WEBGL);
   noStroke();

   cam = createCapture(VIDEO);
   cam.size(1024, 768);
   cam.hide();
 }

function drawLoadingBar(x,y,w,h)
{

    fill(125);
    rect(x,y, w,h);
    var perc = frameCount % w;
    fill(185);
console.log("drawing at: " + x + "," + y + " size: " + perc + "," + h);
    rect(x,y,perc,h)
}

 function draw() {
   // shader() sets the active shader with our shader
   //shader(theShader);

   // passing cam as a texture
   //theShader.setUniform('tex0', cam);
   background(0,0,0)
   imageMode(CENTER)
   let img = cam.get( 0, 0, cam.width, cam.height );
   img.resize(256,192)
   image(img,-img.width/2,0,img.width,img.height)

   if(loading == true)
   {
       drawLoadingBar( 128/2+ 5, 0, img.width/2-10, 10)
   }
   if(processed_img != null)
   {
       image(processed_img, img.width - processed_img.width/2,0, processed_img.width, processed_img.height);
   } 
}

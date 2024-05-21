
let loading = false; 
let cam;
let processed_img = null;
let instruction_text;
let instructions_height = 20;
let instruction_canvas;

let json_data = null;


let colour_clusters = []

 function preload(){
 }
var index = 0


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function parseJSON()
{

        console.log("json_data: " + JSON.stringify(json_data));
	processed_img = loadImage(json_data['image_file']); //loadImage("result_images/result.png");
        kmeans_clusters = json_data['kmeans_clusters'];
        
	colour_clusters = []
        for( var i = 0; i < json_data['num_clusters'];i++)
	{
		console.log("cluster" + i + ": " + kmeans_clusters[i])
		colour_clusters.push(color(kmeans_clusters[i][2], kmeans_clusters[i][1],kmeans_clusters[i][0]))
	}
        console.log("kmeans[0]: " + kmeans_clusters[0]);
}

function loadResultsFromJson( file_path )
{
	console.log("loading json file: " + file_path);

	loading = false;
	sleep(1000);
        json_data = loadJSON( file_path, parseJSON )
}

function mousePressed()
{
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
     //}).then((response) => { processed_img = loadImage("result_images/result.png"); loading = false; loadMetaJson(); });
     //}).then((response) => {loadResultsFromJson("http://3.149.240.150/working_data/data.json") });
     }).then((response) => {loadResultsFromJson("working_data/data.json") });
}


function setup() {

   // shaders require WEBGL mode to work
   createCanvas(768,192 + instructions_height, WEBGL);
   noStroke();

    instruction_canvas = createGraphics(width/2,instructions_height)
    console.log("creating instrucion canvas with size: " +  width/2 + "," + instructions_height);
    instruction_canvas.fill(255);
    instruction_canvas.text("click the webcam image to startproceessing", 5,instruction_canvas.height/2);

   cam = createCapture(VIDEO);
   cam.size(1024, 768);
   cam.hide();

   textFont('Source Code Pro');
 }

function drawLoadingBar(x,y,w,h)
{
    fill(125);
    rect(x,y, w,h);
    var perc = frameCount % w;
    fill(185);
    rect(x,y,perc,h)
}

function drawInstructions()
{
   imageMode(CORNER);
   drawingContext.disable(drawingContext.DEPTH_TEST);
   drawingContext.enable(drawingContext.BLEND);
   image( instruction_canvas, -instruction_canvas.width/2, height/2- instruction_canvas.height);
   drawingContext.enable(drawingContext.DEPTH_TEST);

}


function drawText(font) {
  fontLoaded = true;
  textFont(font, 52);
  fill(120, 255, 0);
}


 function draw() {
   background(0,0,0)
   
   imageMode(CORNER)
   let img = cam.get( 0, 0, cam.width, cam.height );
   img.resize(256,192)
   image(img,-width/2+64,-img.height/2,img.width,img.height)

   if(loading == true)
   {
       drawLoadingBar( 128/2+ 5, 0, img.width/2-10, 10)
   }
   if(processed_img != null)
   {
       image(processed_img, -width/2+64 +img.width,-img.height/2, processed_img.width, processed_img.height);
   } 

   drawInstructions();

   if( colour_clusters != null)
   {
    	for( var i = 0; i < colour_clusters.length; i++)
	{
		//fill(colour_clusters[i][0], colour_clusters[i][1], colour_clusters[i][2]);
		fill( colour_clusters[i] );
		stroke(255);
		rect(256, -height/2 + 5 + 30 * i, 20,20);
		txt_line = String(colour_clusters[i][0]) + "," +String( colour_clusters[i][1])  + "," + String(colour_clusters[i][2])
		//text(txt_line,276, -height/2 + 5 + 30 * i)
		console.log(txt_line);
		
	}
  }
}


	

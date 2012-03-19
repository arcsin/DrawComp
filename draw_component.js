/************************************
*ArcSin, 2012.
*KiCADlibCenter     
*ver 0.1
************************************/
const scales = [0.5,0.7,1,1.5,2,3,4,6,8,12,16,23,32,48,64,80,128];

const THICKNESS_MIN = 4;   
   
const TARGET_PIN_RADIUS = 12  /* Circle diameter drawn at the active end of pins */
const NCSYMB_PIN_DIM = TARGET_PIN_RADIUS;
//#define DEFAULT_TEXT_SIZE   50  /* Default size for field texts */
//#define PART_NAME_LEN       15  /* Maximum length of part name. */
//#define PREFIX_NAME_LEN     5   /* Maximum length of prefix (IC, R, SW etc.). */
//#define PIN_WIDTH           100 /* Width between 2 pins in internal units. */
//#define PIN_LENGTH          300 /* Default Length of each pin to be drawn. */

//#if defined(KICAD_GOST)
const INVERT_PIN_RADIUS = 20  /* Radius of inverted pin circle. */
//#else
//#define INVERT_PIN_RADIUS   35  /* Radius of inverted pin circle. */
//#endif
const TXTMARGE = 5; // not true
const CLOCK_PIN_DIM = 40  /* Dim of clock pin symbol. */
const IEEE_SYMBOL_PIN_DIM = 40  /* Dim of special pin symbol. */
const NONLOGIC_PIN_DIM = 30   /* Dim of nonlogic pin symbol (X). */	
	
	
function DrawPanObj(_canvas,draw_section)
{
    this.canvas = _canvas;
	this.context = _canvas.getContext('2d');
	
	this.draw_strings = draw_section.replace('\r', '').split('\n'); 
	
  
	
	this.iscale = 1;
	this.scale = 1;
	
	this.originx = 0;
	this.originy = 0;	

	this. unit_global = "1";
	this.TextInside;//offset for pin name position
	this.draw_pinnumber; // (display pin number) or N (do not display pin number).
	this.draw_pinname;//(display pin name) or N (do not display pin name).
	
} 	

DrawPanObj.prototype.Clear = function()
{
// clear
	this.context.clearRect(this.originx,this.originy ,
	this.canvas.width/this.scale, this.canvas.height/this.scale);
	//this.context.strokeStyle ="rgb(160, 160, 0)";  //  color
	//this.context.lineWidth = 1;
	//this.context.strokeRect(this.originx,this.originy , this.canvas.width/this.scale, this.canvas.height/this.scale); 
	
}

DrawPanObj.prototype.Draw = function()
{
	
					
	this.context.strokeStyle ="rgb(0, 0, 192)";  //  color
	this.context.lineWidth = 1;
	this.context.beginPath(); 
	this.context.moveTo(-1000,0);
	this.context.lineTo(1000,0); 
	this.context.moveTo(0,-1000);
	this.context.lineTo(0,1000); 
	this.context.stroke();
		
	for(var i = 0; i < this.draw_strings.length; i++){
	var	str_line = this.draw_strings[i].replace(/\s+/g,' ');
	args=str_line.split(" ");
    
	//BestScale(str_line,context);

			
   //console.log(context);

switch (args[0]) {
	case "DEF": // DEF
	// CODING_SWITCH  SW      0        40           Y             Y        1 F N
	//     name   reference unused text_offset draw_pinnumber draw_pinname unit_count units_locked option_flag
	this.TextInside = parseInt(args[4]);//offset for pin name position
	this.draw_pinnumber = args[5]; // (display pin number) or N (do not display pin number).
	this.draw_pinname = args[6]; //(display pin name) or N (do not display pin name).
	break

	case "F0": // 
	//F0 reference posx posy text_size text_orient visibile htext_justify vtext_justify
	//F0     "U"    100  400  50            H          V        C              C
	var reference = args[1];
	reference = reference.replace(/\"/g,'');
	//reference = reference+"?";
	var posx = parseInt(args[2]);
	var posy = parseInt(args[3]);
	var text_size = parseInt(args[4]);
	var text_orient = args[5];
	var visible = args[6];
	
	// textAlign aligns text horizontally relative to placement
	switch (args[7]) {
	case "L": context.textAlign = "left"; 	break
	case "C": this.context.textAlign = "center"; break
	case "R": this.context.textAlign = "right"; 	break
	}
	// textBaseline aligns text vertically relative to font style
	switch (args[8]) {
	case "B": this.context.textBaseline = "bottom";	break
	case "C": this.context.textBaseline = "middle"; break
	case "T": this.context.textBaseline = "top";	break
	}
	if (visible=="V")
	{
		this.context.fillStyle    = "rgb(0, 160, 160)";
		this.context.font         = text_size*1.5+'px txt';
		if (text_orient=="H")
		{
			this.context.fillText(reference, posx,-posy);
		}
		if (text_orient=="V")
		{
			this.context.save();
			this.context.translate(posx,-posy);
			this.context.rotate(-Math.PI/2);
			this.context.fillText(reference, 0,0);
			this.context.restore();
		}
	}
	break
	case "F1":
	//F1 name posx posy text_size text_orient visibility htext_justify vtext_justify
	//F1 "EL84" 300 -300 50 H V C C
	var name = args[1];
	name = name.replace(/\"/g,'');
	
	var posx = parseInt(args[2]);
	var posy = parseInt(args[3]);
	var text_size = parseInt(args[4]);
	var text_orient = args[5];
	var visible = args[6];
		
	// textAlign aligns text horizontally relative to placement
	switch (args[7]) {
	case "L": this.context.textAlign = "left"; 	break
	case "C": this.context.textAlign = "center"; break
	case "R": this.context.textAlign = "right"; 	break
	}
	// textBaseline aligns text vertically relative to font style
	switch (args[8]) {
	case "B": this.context.textBaseline = "bottom";	break
	case "C": this.context.textBaseline = "middle"; break
	case "T": this.context.textBaseline = "top";	break
	}
	
	if (visible=="V")
	{
		this.context.fillStyle    = "rgb(0, 160, 160)";
		this.context.font         = text_size*1.5+'px txt';
		if (text_orient=="H")
		{
			this.context.fillText(name, posx,-posy);
		}
		if (text_orient=="V")
		{
			this.context.save();
			this.context.translate(posx,-posy);
			this.context.rotate(-Math.PI/2);
			this.context.fillText(name, 0,0);
			this.context.restore();
		}
	}
	break	
  case "A": // arc
	//A 109   110  109   -333         -1747      0    1        0       N     200    50    0   100
	//A posx posy radius start_angle end_angle unit convert thickness fill startx starty endx endy
	
	var unit = (args[6]);
	if ((unit!=this.unit_global)&&(unit!="0")) break
	//console.log(unit);
	var posx = parseInt(args[1]);
	var posy = parseInt(args[2]);
	var radius = parseInt(args[3]);
	
	var start_angle=parseInt(args[4])/10;  // not scale, 0.1°
	var end_angle=parseInt(args[5])/10;    // not scale
	var dist_angle = start_angle-end_angle;
	if (dist_angle<0) dist_angle+=360;
	
	
	var thickness = parseInt(args[8]);
	if (thickness==0) thickness = 4;
	var filling = args[9];
	
	if (filling=="F")  
		this.context.fillStyle ="rgb(160, 0, 0)";  //  color
	if (filling=="f")  
		this.context.fillStyle ="rgb(255, 255, 128)";  //  color
	if ((filling=="F")||(filling=="f"))
	{
		this.context.beginPath(); 
		this.context.arc(posx,-posy, radius, -radian(start_angle),-radian(end_angle),dist_angle>180);
		this.context.lineTo(posx,-posy);
		this.context.closePath(); 
		this.context.fill(); 
	}
	if ((filling=="N")||(filling=="f"))	
	{
		this.context.strokeStyle ="rgb(160, 0, 0)";  //  color
		this.context.lineCap = 'round';   // закругленные концы линии
		this.context.lineWidth = thickness + 1;
		this.context.beginPath(); 
		this.context.arc(posx,-posy, radius, -radian(start_angle), -radian(end_angle), dist_angle>180);
		this.context.stroke();
	}
	break
	
	case "C": //circle
	//C   0    0    150    0     1        0      N
	//C posx posy radius unit convert thickness fill
	var unit = (args[4]);
	if ((unit!=this.unit_global)&&(unit!="0")) break
	var posx = parseInt(args[1]);
	var posy = parseInt(args[2]);
	var radius = parseInt(args[3]);
	var thickness = parseInt(args[6]);
	var filling = args[7];
	
	if (filling=="F")  
		this.context.fillStyle ="rgb(160, 0, 0)";  //  color
	if (filling=="f")  
		this.context.fillStyle ="rgb(255, 255, 128)";  //  color
	if ((filling=="F")||(filling=="f"))
	{
		this.context.beginPath(); 
		this.context.arc(posx,-posy, radius, 0, radian(360));
		this.context.fill(); 
	}
	if ((filling=="N")||(filling=="f"))	
	{
		this.context.strokeStyle ="rgb(160, 0, 0)";  //  color
		this.context.lineWidth = thickness + 1;
		this.context.beginPath(); 
		this.context.arc(posx,-posy, radius, 0, radian(360));
		this.context.stroke();
	}
	break
 
	case "P": //polyline
    //P point_count unit convert thickness (posx posy)*        fill 
    //P      2       0      1       20       -100 -30  100 -30  N
  
	var unit = (args[2]);
	if ((unit!=unit_global)&&(unit!="0")) break
	var point_count = parseInt(args[1]);
	var thickness = parseInt(args[4]);
	thickness+=4; 
	var filling = args[5+2*point_count];
	
	if (filling=="F")  
		this.context.fillStyle ="rgb(160, 0, 0)";  //  color
	if (filling=="f")  
		this.context.fillStyle ="rgb(255, 255, 128)";  //  color
	if ((filling=="F")||(filling=="f"))
	{
		this.context.beginPath(); 
		this.context.moveTo(parseInt(args[5]),-parseInt(args[6]));
		for (i=0;i<point_count;i++)
				this.context.lineTo(parseInt(args[7+2*i]),-parseInt(args[8+2*i])); 
		this.context.closePath(); 
		this.context.fill(); 
	}
	if ((filling=="N")||(filling=="f"))	
	{
		this.context.strokeStyle ="rgb(160, 0, 0)";  //  color
		this.context.lineWidth = thickness + 1;
		this.context.lineCap = 'round';   // закругленные концы линии
		this.context.beginPath(); 
		this.context.moveTo(parseInt(args[5]),-parseInt(args[6]));
		for (i=0;i<point_count;i++)
				this.context.lineTo(parseInt(args[7+2*i]),-parseInt(args[8+2*i])); 
		this.context.stroke();
	}
	break

	case "S": //rectangular
	//S startx starty endx endy unit convert thickness fill
	//S -100     100   100 -50   0      1       8       N

	var unit = (args[5]);
	if ((unit!=this.unit_global)&&(unit!="0")) break
	var startx = Math.min(parseInt(args[1]),parseInt(args[3]));
	var starty = Math.min(parseInt(args[2]),parseInt(args[4]));
	var endx = Math.max(parseInt(args[1]),parseInt(args[3]));
	var endy = Math.max(parseInt(args[2]),parseInt(args[4]));

	var thickness = parseInt(args[7]);
	var filling = args[8];
	if (filling=="F")  
		this.context.fillStyle ="rgb(160, 0, 0)";  //  color
	if (filling=="f")  
		this.context.fillStyle ="rgb(255, 255, 128)";  //  color
	if ((filling=="F")||(filling=="f"))
	{
		this.context.fillRect(startx,-endy, endx-startx, endy-starty); 
	}
	if ((filling=="N")||(filling=="f"))	
	{
		this.context.strokeStyle ="rgb(160, 0, 0)";  //  color
		this.context.lineJoin = 'round';
		this.context.lineWidth = thickness + 1;
		this.context.strokeRect(startx,-endy, endx-startx, endy-starty); 
	}
	
	break
 
	case "T": //text
 //T direction posx posy text_size text_type unit convert  text
 //T    0     -1500  -900    100      0        0      0  1234567890  Italic 1 L B
	
	var unit = (args[6]);
	if ((unit!=this.unit_global)&&(unit!="0")) break
	var posx = parseInt(args[2]);
	var posy = parseInt(args[3]);
	var direction = parseInt(args[1]);  // 900  - vertical
 	var text_size = parseInt(args[4]);
	
	var text = args[8];
	
	var italic = (args[9]=="Italic")?"italic ":"";
	var bold = (args[10]=="1")?"bold ":"";
		
	this.context.fillStyle    = "rgb(160, 0, 0)";
	this.context.font         = italic+bold+text_size*1.5+'px '+'txt';
	//console.log(text_size*1.5+'px '+italic+bold+'Lucida Sans Unicode');

	// textAlign aligns text horizontally relative to placement
	switch (args[11]) {
	case "L": this.context.textAlign = "left"; 	break
	case "C": this.context.textAlign = "center"; break
	case "R": this.context.textAlign = "right"; 	break
	}
	// textBaseline aligns text vertically relative to font style
	switch (args[12]) {
	case "B": this.context.textBaseline = "bottom";	break
	case "C": this.context.textBaseline = "middle"; break
	case "T": this.context.textBaseline = "top";	break
	}
		
	this.context.save();
	this.context.translate(posx,-posy);
	this.context.rotate(-radian(direction/10));
	this.context.fillText(text, 0,0);
	this.context.restore();
	
	break

 case "X": //pins
// X name num posx posy length direction name_text_size num_text_size unit convert electrical_type pin_type
// X  COM  1   -350 450  300       R        60               60         1     1         P             I
	var unit = (args[9]);
	if ((unit!=this.unit_global)&&(unit!="0")) break
	var name = args[1];
	var num = args[2];
	var posx = parseInt(args[3]);
	var posy = parseInt(args[4]);
	var length = parseInt(args[5]);
	var direction = args[6];
	var name_text_size = args[7];
	var num_text_size = args[8];
	var electrical_type = args[11];
	var pin_type = (!args[12])?" ":args[12];  
// hiden pin "rgb(128, 128, 128)"	
	// --------------------------------------------------------------------
	var MapX1 = MapY1 = 0;
    var x1    = posx;
    var y1    = posy;
	
 	
	switch( direction )
    {
    case "U":
        y1    = posy + length;
        MapY1 = 1;
        break

    case "D":
        y1    = posy - length;
        MapY1 = -1;
        break

    case "L":
        x1    = posx - length;
        MapX1 = 1;
        break;

    case "R":
        x1    = posx + length;
        MapX1 = -1;
        break;
    }

	var INVERT = pin_type.indexOf('I') + 1;
	var CLOCK = pin_type.indexOf('C') + 1;
    var LOWLEVEL_IN = pin_type.indexOf('L') +1;
	var LOWLEVEL_OUT = pin_type.indexOf('V') + 1;
	var CLOCK_FALL = pin_type.indexOf('F') + 1;
	var NONLOGIC = pin_type.indexOf('X') + 1;
	
    if (pin_type=="N")  // not visible
	{
		//console.log("pin_type="+pin_type);
		this.context.strokeStyle ="rgb(128, 128, 128)";
	}
	else
		this.context.strokeStyle ="rgb(160, 0, 0)";  //  color
	
	this.context.lineWidth = 4;
	
	if( INVERT )
    {
       	this.context.beginPath(); 
		this.context.arc(MapX1 * INVERT_PIN_RADIUS + x1,-MapY1 * INVERT_PIN_RADIUS - y1,INVERT_PIN_RADIUS, 0, radian(360));
		this.context.moveTo(MapX1 * INVERT_PIN_RADIUS * 2 + x1,-MapY1 * INVERT_PIN_RADIUS * 2 - y1);
		this.context.lineTo(posx,-posy); 
		this.context.stroke();        
    }
    else if( CLOCK_FALL ) /* an alternative for Inverted Clock */
    {
       	this.context.beginPath(); 
		this.context.moveTo(x1 + MapY1 * CLOCK_PIN_DIM,y1 - MapX1 * CLOCK_PIN_DIM);
		this.context.lineTo(x1 + MapX1 * CLOCK_PIN_DIM,y1 + MapY1 * CLOCK_PIN_DIM); 
		this.context.lineTo(x1 - MapY1 * CLOCK_PIN_DIM,y1 + MapX1 * CLOCK_PIN_DIM); 
		this.context.moveTo(MapX1 * CLOCK_PIN_DIM + x1,MapY1 * CLOCK_PIN_DIM + y1);
		this.context.lineTo(posx, posy); 		
		this.context.stroke();
    }
    else
    {
        this.context.beginPath(); 
		this.context.moveTo(x1,-y1);
		this.context.lineTo(posx, -posy); 		
		this.context.stroke();
    }

    if( CLOCK )
    {
        if( MapY1 == 0 ) /* MapX1 = +- 1 */
        {
            
			this.context.beginPath(); 
			this.context.moveTo(x1, y1 + CLOCK_PIN_DIM);
			this.context.lineTo(x1 - MapX1 * CLOCK_PIN_DIM,y1 );
			this.context.lineTo(x1, y1 - CLOCK_PIN_DIM );
			this.context.stroke();
			
        }
        else    /* MapX1 = 0 */
        {
			this.context.beginPath(); 
			this.context.moveTo(x1 + CLOCK_PIN_DIM, y1);
			this.context.lineTo(x1,y1 - MapY1 * CLOCK_PIN_DIM );
			this.context.lineTo(x1 - CLOCK_PIN_DIM, y1 );
			this.context.stroke();
		}
    }

    if( LOWLEVEL_IN )     /* IEEE symbol "Active Low Input" */
    {
        if( MapY1 == 0 )            /* MapX1 = +- 1 */
        {
            this.context.beginPath(); 
			this.context.moveTo(x1 + MapX1 * IEEE_SYMBOL_PIN_DIM * 2, y1);
			this.context.lineTo( x1 + MapX1 * IEEE_SYMBOL_PIN_DIM * 2, y1 - IEEE_SYMBOL_PIN_DIM );
			this.context.lineTo(x1, y1 );
			this.context.stroke();
		}
        else    /* MapX1 = 0 */
        {
			this.context.beginPath(); 
			this.context.moveTo(x1, y1 + MapY1 * IEEE_SYMBOL_PIN_DIM * 2 );
			this.context.lineTo( x1 - IEEE_SYMBOL_PIN_DIM, y1 + MapY1 * IEEE_SYMBOL_PIN_DIM * 2 );
			this.context.lineTo(x1, y1 );
			this.context.stroke();
			          
        }
    }

    if(  LOWLEVEL_OUT )    /* IEEE symbol "Active Low Output" */
    {
        if( MapY1 == 0 )            /* MapX1 = +- 1 */
        {
            this.context.beginPath(); 
			this.context.moveTo(x1, y1 - IEEE_SYMBOL_PIN_DIM );
			this.context.lineTo( x1 + MapX1 * IEEE_SYMBOL_PIN_DIM * 2, y1);
			this.context.stroke();
        }
        else    /* MapX1 = 0 */
        {
            this.context.beginPath(); 
			this.context.moveTo(x1 - IEEE_SYMBOL_PIN_DIM, y1  );
			this.context.lineTo( x1 , y1 + MapY1 * IEEE_SYMBOL_PIN_DIM * 2);
			this.context.stroke();
			
        }
    }
    
	else if( NONLOGIC ) // NonLogic pin symbol 
    {
        this.context.beginPath(); 
		this.context.moveTo(x1 - (MapX1 + MapY1) * NONLOGIC_PIN_DIM,
					 -(y1 - (MapY1 - MapX1) * NONLOGIC_PIN_DIM));
		this.context.lineTo(x1 + (MapX1 + MapY1) * NONLOGIC_PIN_DIM,
					 -(y1 + (MapY1 - MapX1) * NONLOGIC_PIN_DIM)); 
		this.context.moveTo(x1 - (MapX1 - MapY1) * NONLOGIC_PIN_DIM,
					 -(y1 - (MapY1 + MapX1) * NONLOGIC_PIN_DIM));
		this.context.lineTo(x1 + (MapX1 - MapY1) * NONLOGIC_PIN_DIM,
					 -(y1 + (MapY1 + MapX1) * NONLOGIC_PIN_DIM)); 
		this.context.stroke();
    }

    if( pin_type == "NC" )   // Draw a N.C. symbol    
    {
        this.context.beginPath(); 
		this.context.moveTo(posx - NCSYMB_PIN_DIM,-(posy - NCSYMB_PIN_DIM));
		this.context.lineTo(posx + NCSYMB_PIN_DIM,-(posy + NCSYMB_PIN_DIM)); 
		this.context.moveTo(posx + NCSYMB_PIN_DIM,-(posy - NCSYMB_PIN_DIM));
		this.context.lineTo(posx - NCSYMB_PIN_DIM,-(posy + NCSYMB_PIN_DIM)); 
		this.context.stroke();
    }
	else // Draw circle
	{
		this.context.lineWidth = 0.5;
		this.context.beginPath(); 
		this.context.arc(posx,-posy,TARGET_PIN_RADIUS, 0, radian(360));
		this.context.stroke();
	}

	if( draw_pinnumber=="Y" )
	
	if (pin_type=="N")  // not visible
		this.context.fillStyle ="rgb(128, 128, 128)";
	else
		this.context.fillStyle    = "rgb(160, 0, 0)";
	this.context.font         = num_text_size*1.5+'px '+'txt';
	this.context.textAlign = "center";   //GR_TEXT_HJUSTIFY_CENTER
	
	this.context.save();
	if (TextInside)
	{
		if (( direction == "U")||( direction == "D"))
		{
			this.context.translate(x1 - TXTMARGE,-(y1 + posy) / 2 );
			this.context.textBaseline = "bottom";  //  GR_TEXT_VJUSTIFY_BOTTOM
			this.context.rotate(-Math.PI/2);
		}   
	   if (( direction == "L")||( direction == "R"))
		{	this.context.textBaseline = "bottom";  //  GR_TEXT_VJUSTIFY_BOTTOM
			this.context.translate((x1 + posx) / 2,-(y1 - TXTMARGE) );
			
		}
	}
	else    //**** Draw num & text pin outside  **
	{
		if (( direction == "U")||( direction == "D")) // Its a vertical line. 
		{
			this.context.translate(x1 + TXTMARGE,-(y1 + posy) / 2 );
			this.context.textBaseline = "top";  //  GR_TEXT_VJUSTIFY_BOTTOM
			this.context.rotate(-Math.PI/2);
		}   
	   if (( direction == "L")||( direction == "R")) // Its an horizontal line. 
		{	this.context.textBaseline = "top";  //  GR_TEXT_VJUSTIFY_BOTTOM
			this.context.translate((x1 + posx) / 2,-(y1 + TXTMARGE) );
			
		}
	}
	this.context.fillText(num, 0,0);
	this.context.restore();
	
	if( (draw_pinname=="Y")&&(name!="~"))
	{
		if (pin_type=="N")  // not visible
			this.context.fillStyle ="rgb(128, 128, 128)";
		else
			this.context.fillStyle    = "rgb(0, 160, 160)";
		this.context.font         = name_text_size*1.5+'px '+'txt';
		this.context.textBaseline = "middle";  
		this.context.save();
		if (TextInside)// Draw the text inside,
		{
			//console.log("TextInside");
			switch( direction )
			{
			case "U":
				this.context.translate(x1 , -(y1 + TextInside)); 
				this.context.textAlign = "left";  
				this.context.rotate(-Math.PI/2);
			break
			case "D":
				this.context.translate(x1 , -(y1 - TextInside));  
				this.context.textAlign = "right"; 
				this.context.rotate(-Math.PI/2);
			break
			case "L":
			this.context.translate(x1 - TextInside , -y1 );
			this.context.textAlign = "right";  
			break
			case "R":
				this.context.translate(x1 + TextInside , -y1);
				this.context.textAlign = "left";
			break;
			}
		}
		else //**** Draw num & text pin outside  **
		{
		console.log("!TextInside");
			this.context.textAlign = "center"; 
			this.context.textBaseline = "bottom";  //  GR_TEXT_VJUSTIFY_BOTTOM
			if (( direction == "U")||( direction == "D")) // Its a vertical line. 
			{
				this.context.translate(x1 - TXTMARGE,-(y1 + posy) / 2 );
				this.context.rotate(-Math.PI/2);
			}   
			if (( direction == "L")||( direction == "R")) // Its an horizontal line. 
			{	
				this.context.translate((x1 + posx) / 2,-(y1 - TXTMARGE) );
			}
		}
		this.context.fillText(name, 0,0);
		this.context.restore();
	}
	break
	default:
    alert("["+args[0]+"] - unknown letter in COMP//DRAW");
}
	
	}
}	
	

/*function DrawScaleRect(this.context){
context.strokeStyle ="rgb(128,255, 128)";  //  color
		context.lineJoin = 'round';
		context.lineWidth = 1;
		context.strokeRect(minx,-maxy, maxx-minx, maxy-miny); 

}
*/


function BestScale(){
/*	str_line = str_line.replace(/\s+/g,' ');
	
	
	args=str_line.split(" ");
   //console.log(context);

switch (args[0]) {
/*	case "DEF": // DEF
	// CODING_SWITCH  SW      0        40           Y             Y        1 F N
	//     name   reference unused text_offset draw_pinnumber draw_pinname unit_count units_locked option_flag

	TextInside = parseInt(args[4]);//offset for pin name position
	draw_pinnumber = args[5]; // (display pin number) or N (do not display pin number).
	draw_pinname = args[6]; //(display pin name) or N (do not display pin name).
	break
	
	case "F0": // 
	//F0 reference posx posy text_size text_orient visibile htext_justify vtext_justify
	//F0     "U"    100  400  50            H          V        C              C
	var reference = args[1];
	reference = reference.replace(/\"/g,'');
	//reference = reference+"?";
	var posx = parseInt(args[2]);
	var posy = parseInt(args[3]);
	var text_size = parseInt(args[4]);
	var text_orient = args[5];
	var visible = args[6];
	
	// textAlign aligns text horizontally relative to placement
	switch (args[7]) {
	case "L": context.textAlign = "left"; 	break
	case "C": context.textAlign = "center"; break
	case "R": context.textAlign = "right"; 	break
	}
	// textBaseline aligns text vertically relative to font style
	switch (args[8]) {
	case "B": context.textBaseline = "bottom";	break
	case "C": context.textBaseline = "middle"; break
	case "T": context.textBaseline = "top";	break
	}
	if (visible=="V")
	{
		context.fillStyle    = "rgb(0, 160, 160)";
		context.font         = text_size*1.5+'px txt';
		if (text_orient=="H")
		{
			context.fillText(reference, posx,-posy);
		}
		if (text_orient=="V")
		{
			context.save();
			context.translate(posx,-posy);
			context.rotate(-Math.PI/2);
			context.fillText(reference, 0,0);
			context.restore();
		}
	}
	break 
	case "F1":
	//F1 name posx posy text_size text_orient visibility htext_justify vtext_justify
	//F1 "EL84" 300 -300 50 H V C C
	var name = args[1];
	name = name.replace(/\"/g,'');
	
	var posx = parseInt(args[2]);
	var posy = parseInt(args[3]);
	var text_size = parseInt(args[4]);
	var text_orient = args[5];
	var visible = args[6];
		
	// textAlign aligns text horizontally relative to placement
	switch (args[7]) {
	case "L": context.textAlign = "left"; 	break
	case "C": context.textAlign = "center"; break
	case "R": context.textAlign = "right"; 	break
	}
	// textBaseline aligns text vertically relative to font style
	switch (args[8]) {
	case "B": context.textBaseline = "bottom";	break
	case "C": context.textBaseline = "middle"; break
	case "T": context.textBaseline = "top";	break
	}
	
	if (visible=="V")
	{
		context.fillStyle    = "rgb(0, 160, 160)";
		context.font         = text_size*1.5+'px txt';
		if (text_orient=="H")
		{
			context.fillText(name, posx,-posy);
		}
		if (text_orient=="V")
		{
			context.save();
			context.translate(posx,-posy);
			context.rotate(-Math.PI/2);
			context.fillText(name, 0,0);
			context.restore();
		}
	}
	break */	
 /* case "A": // arc
	//A 109   110  109   -333         -1747      0    1        0       N     200    50    0   100
	//A posx posy radius start_angle end_angle unit convert thickness fill startx starty endx endy
	
	var unit = (args[6]);
	if ((unit!=unit_global)&&(unit!="0")) break
	//console.log(unit);
	var posx = parseInt(args[1]);
	var posy = parseInt(args[2]);
	var radius = parseInt(args[3]);
	
	var start_angle=parseInt(args[4])/10;  // not scale, 0.1°
	var end_angle=parseInt(args[5])/10;    // not scale
	var dist_angle = start_angle-end_angle;
	if (dist_angle<0) dist_angle+=360;
	///!!!	
	break
	
	case "C": //circle
	//C   0    0    150    0     1        0      N
	//C posx posy radius unit convert thickness fill
	var unit = (args[4]);
	if ((unit!=unit_global)&&(unit!="0")) break
	var posx = parseInt(args[1]);
	var posy = parseInt(args[2]);
	var radius = parseInt(args[3]);
	if (x_max < posx+radius) x_max = posx+radius;
	if (y_max < posy+radius) y_max = posy+radius;
	if (x_min > posx-radius) x_min = posy-radius;
	if (y_min > posy-radius) y_min = posy-radius;
	break
 
	case "P": //polyline
    //P point_count unit convert thickness (posx posy)*        fill 
    //P      2       0      1       20       -100 -30  100 -30  N
  
	var unit = (args[2]);
	if ((unit!=unit_global)&&(unit!="0")) break
	var point_count = parseInt(args[1]);
	for (i=0;i<point_count;i++)
		{	
			var x = parseInt(args[7+2*i]);
			var y = parseInt(args[8+2*i]);
			if (x_max < x) x_max = x;
			if (y_max < y) y_max = y;
			if (x_min > x) x_min = y;
			if (y_min > y) y_min = y;
					
		}	 
	break

	case "S": //rectangular
	//S startx starty endx endy unit convert thickness fill
	//S -100     100   100 -50   0      1       8       N

	var unit = (args[5]);
	if ((unit!=unit_global)&&(unit!="0")) break
	if (x_max < parseInt(args[1])) x_max = parseInt(args[1]);
	if (x_min > parseInt(args[1])) x_min = parseInt(args[1]);
	
	if (x_max < parseInt(args[3])) x_max = parseInt(args[3]);
	if (x_min > parseInt(args[3])) x_min = parseInt(args[3]);
	
	if (y_max < parseInt(args[2])) y_max = parseInt(args[2]);
	if (y_max < parseInt(args[2])) y_max = parseInt(args[2]);
	
	if (y_min > parseInt(args[4])) y_min = parseInt(args[4]);
	if (y_min > parseInt(args[4])) y_min = parseInt(args[4]);
	
	break
 
	case "T": //text
 //T direction posx posy text_size text_type unit convert  text
 //T    0     -1500  -900    100      0        0      0  1234567890  Italic 1 L B
	
	var unit = (args[6]);
	if ((unit!=unit_global)&&(unit!="0")) break
	var posx = parseInt(args[2]);
	var posy = parseInt(args[3]);
	var direction = parseInt(args[1]);  // 900  - vertical
 	var text_size = parseInt(args[4]);
	
	var text = args[8];
	
	var italic = (args[9]=="Italic")?"italic ":"";
	var bold = (args[10]=="1")?"bold ":"";
		
	context.fillStyle    = "rgb(160, 0, 0)";
	context.font         = italic+bold+text_size*1.5+'px '+'txt';
	//console.log(text_size*1.5+'px '+italic+bold+'Lucida Sans Unicode');

	// textAlign aligns text horizontally relative to placement
	switch (args[11]) {
	case "L": context.textAlign = "left"; 	break
	case "C": context.textAlign = "center"; break
	case "R": context.textAlign = "right"; 	break
	}
	// textBaseline aligns text vertically relative to font style
	switch (args[12]) {
	case "B": context.textBaseline = "bottom";	break
	case "C": context.textBaseline = "middle"; break
	case "T": context.textBaseline = "top";	break
	}
		
	context.save();
	context.translate(posx,-posy);
	context.rotate(-radian(direction/10));
	context.fillText(text, 0,0);
	context.restore();
	
	break

 case "X": //pins
// X name num posx posy length direction name_text_size num_text_size unit convert electrical_type pin_type
// X  COM  1   -350 450  300       R        60               60         1     1         P             I
	var unit = (args[9]);
	if ((unit!=unit_global)&&(unit!="0")) break
	var name = args[1];
	var num = args[2];
	var posx = parseInt(args[3]);
	var posy = parseInt(args[4]);
	var length = parseInt(args[5]);
	var direction = args[6];
	var name_text_size = args[7];
	var num_text_size = args[8];
	var electrical_type = args[11];
	var pin_type = (!args[12])?" ":args[12];  
// hiden pin "rgb(128, 128, 128)"	
	// --------------------------------------------------------------------
	var MapX1 = MapY1 = 0;
    var x1    = posx;
    var y1    = posy;
	
 	
	switch( direction )
    {
    case "U":
        y1    = posy + length;
        MapY1 = 1;
        break

    case "D":
        y1    = posy - length;
        MapY1 = -1;
        break

    case "L":
        x1    = posx - length;
        MapX1 = 1;
        break;

    case "R":
        x1    = posx + length;
        MapX1 = -1;
        break;
    }

	var INVERT = pin_type.indexOf('I') + 1;
	var CLOCK = pin_type.indexOf('C') + 1;
    var LOWLEVEL_IN = pin_type.indexOf('L') +1;
	var LOWLEVEL_OUT = pin_type.indexOf('V') + 1;
	var CLOCK_FALL = pin_type.indexOf('F') + 1;
	var NONLOGIC = pin_type.indexOf('X') + 1;
	
    if (pin_type=="N")  // not visible
	{
		//console.log("pin_type="+pin_type);
		context.strokeStyle ="rgb(128, 128, 128)";
	}
	else
		context.strokeStyle ="rgb(160, 0, 0)";  //  color
	
	context.lineWidth = 4;
	
	if( INVERT )
    {
       	context.beginPath(); 
		context.arc(MapX1 * INVERT_PIN_RADIUS + x1,-MapY1 * INVERT_PIN_RADIUS - y1,INVERT_PIN_RADIUS, 0, radian(360));
		context.moveTo(MapX1 * INVERT_PIN_RADIUS * 2 + x1,-MapY1 * INVERT_PIN_RADIUS * 2 - y1);
		context.lineTo(posx,-posy); 
		context.stroke();        
    }
    else if( CLOCK_FALL ) // an alternative for Inverted Clock 
    {
       	context.beginPath(); 
		context.moveTo(x1 + MapY1 * CLOCK_PIN_DIM,y1 - MapX1 * CLOCK_PIN_DIM);
		context.lineTo(x1 + MapX1 * CLOCK_PIN_DIM,y1 + MapY1 * CLOCK_PIN_DIM); 
		context.lineTo(x1 - MapY1 * CLOCK_PIN_DIM,y1 + MapX1 * CLOCK_PIN_DIM); 
		context.moveTo(MapX1 * CLOCK_PIN_DIM + x1,MapY1 * CLOCK_PIN_DIM + y1);
		context.lineTo(posx, posy); 		
		context.stroke();
    }
    else
    {
        context.beginPath(); 
		context.moveTo(x1,-y1);
		context.lineTo(posx, -posy); 		
		context.stroke();
    }

    if( CLOCK )
    {
        if( MapY1 == 0 ) // MapX1 = +- 1 //
        {
            
			context.beginPath(); 
			context.moveTo(x1, y1 + CLOCK_PIN_DIM);
			context.lineTo(x1 - MapX1 * CLOCK_PIN_DIM,y1 );
			context.lineTo(x1, y1 - CLOCK_PIN_DIM );
			context.stroke();
			
        }
        else    // MapX1 = 0 /
        {
			context.beginPath(); 
			context.moveTo(x1 + CLOCK_PIN_DIM, y1);
			context.lineTo(x1,y1 - MapY1 * CLOCK_PIN_DIM );
			context.lineTo(x1 - CLOCK_PIN_DIM, y1 );
			context.stroke();
		}
    }

    if( LOWLEVEL_IN )     // IEEE symbol "Active Low Input" 
    {
        if( MapY1 == 0 )            // MapX1 = +- 1 
        {
            context.beginPath(); 
			context.moveTo(x1 + MapX1 * IEEE_SYMBOL_PIN_DIM * 2, y1);
			context.lineTo( x1 + MapX1 * IEEE_SYMBOL_PIN_DIM * 2, y1 - IEEE_SYMBOL_PIN_DIM );
			context.lineTo(x1, y1 );
			context.stroke();
		}
        else    //* MapX1 = 0 
        {
			context.beginPath(); 
			context.moveTo(x1, y1 + MapY1 * IEEE_SYMBOL_PIN_DIM * 2 );
			context.lineTo( x1 - IEEE_SYMBOL_PIN_DIM, y1 + MapY1 * IEEE_SYMBOL_PIN_DIM * 2 );
			context.lineTo(x1, y1 );
			context.stroke();
			          
        }
    }

    if(  LOWLEVEL_OUT )    //* IEEE symbol "Active Low Output" 
    {
        if( MapY1 == 0 )            //* MapX1 = +- 1 *
        {
            context.beginPath(); 
			context.moveTo(x1, y1 - IEEE_SYMBOL_PIN_DIM );
			context.lineTo( x1 + MapX1 * IEEE_SYMBOL_PIN_DIM * 2, y1);
			context.stroke();
        }
        else     //MapX1 = 0 
        {
            context.beginPath(); 
			context.moveTo(x1 - IEEE_SYMBOL_PIN_DIM, y1  );
			context.lineTo( x1 , y1 + MapY1 * IEEE_SYMBOL_PIN_DIM * 2);
			context.stroke();
			
        }
    }
    
	else if( NONLOGIC ) // NonLogic pin symbol 
    {
        context.beginPath(); 
		context.moveTo(x1 - (MapX1 + MapY1) * NONLOGIC_PIN_DIM,
					 -(y1 - (MapY1 - MapX1) * NONLOGIC_PIN_DIM));
		context.lineTo(x1 + (MapX1 + MapY1) * NONLOGIC_PIN_DIM,
					 -(y1 + (MapY1 - MapX1) * NONLOGIC_PIN_DIM)); 
		context.moveTo(x1 - (MapX1 - MapY1) * NONLOGIC_PIN_DIM,
					 -(y1 - (MapY1 + MapX1) * NONLOGIC_PIN_DIM));
		context.lineTo(x1 + (MapX1 - MapY1) * NONLOGIC_PIN_DIM,
					 -(y1 + (MapY1 + MapX1) * NONLOGIC_PIN_DIM)); 
		context.stroke();
    }

    if( pin_type == "NC" )   // Draw a N.C. symbol    
    {
        context.beginPath(); 
		context.moveTo(posx - NCSYMB_PIN_DIM,-(posy - NCSYMB_PIN_DIM));
		context.lineTo(posx + NCSYMB_PIN_DIM,-(posy + NCSYMB_PIN_DIM)); 
		context.moveTo(posx + NCSYMB_PIN_DIM,-(posy - NCSYMB_PIN_DIM));
		context.lineTo(posx - NCSYMB_PIN_DIM,-(posy + NCSYMB_PIN_DIM)); 
		context.stroke();
    }
	else // Draw circle
	{
		context.lineWidth = 0.5;
		context.beginPath(); 
		context.arc(posx,-posy,TARGET_PIN_RADIUS, 0, radian(360));
		context.stroke();
	}

	if( draw_pinnumber=="Y" )
	
	if (pin_type=="N")  // not visible
		context.fillStyle ="rgb(128, 128, 128)";
	else
		context.fillStyle    = "rgb(160, 0, 0)";
	context.font         = num_text_size*1.5+'px '+'txt';
	context.textAlign = "center";   //GR_TEXT_HJUSTIFY_CENTER
	
	context.save();
	if (TextInside)
	{
		if (( direction == "U")||( direction == "D"))
		{
			context.translate(x1 - TXTMARGE,-(y1 + posy) / 2 );
			context.textBaseline = "bottom";  //  GR_TEXT_VJUSTIFY_BOTTOM
			context.rotate(-Math.PI/2);
		}   
	   if (( direction == "L")||( direction == "R"))
		{	context.textBaseline = "bottom";  //  GR_TEXT_VJUSTIFY_BOTTOM
			context.translate((x1 + posx) / 2,-(y1 - TXTMARGE) );
			
		}
	}
	else    //**** Draw num & text pin outside  **
	{
		if (( direction == "U")||( direction == "D")) // Its a vertical line. 
		{
			context.translate(x1 + TXTMARGE,-(y1 + posy) / 2 );
			context.textBaseline = "top";  //  GR_TEXT_VJUSTIFY_BOTTOM
			context.rotate(-Math.PI/2);
		}   
	   if (( direction == "L")||( direction == "R")) // Its an horizontal line. 
		{	context.textBaseline = "top";  //  GR_TEXT_VJUSTIFY_BOTTOM
			context.translate((x1 + posx) / 2,-(y1 + TXTMARGE) );
			
		}
	}
	context.fillText(num, 0,0);
	context.restore();
	
	if( (draw_pinname=="Y")&&(name!="~"))
	{
		if (pin_type=="N")  // not visible
			context.fillStyle ="rgb(128, 128, 128)";
		else
			context.fillStyle    = "rgb(0, 160, 160)";
		context.font         = name_text_size*1.5+'px '+'txt';
		context.textBaseline = "middle";  
		context.save();
		if (TextInside)// Draw the text inside,
		{
			//console.log("TextInside");
			switch( direction )
			{
			case "U":
				context.translate(x1 , -(y1 + TextInside)); 
				context.textAlign = "left";  
				context.rotate(-Math.PI/2);
			break
			case "D":
				context.translate(x1 , -(y1 - TextInside));  
				context.textAlign = "right"; 
				context.rotate(-Math.PI/2);
			break
			case "L":
			context.translate(x1 - TextInside , -y1 );
			context.textAlign = "right";  
			break
			case "R":
				context.translate(x1 + TextInside , -y1);
				context.textAlign = "left";
			break;
			}
		}
		else //**** Draw num & text pin outside  **
		{
		console.log("!TextInside");
			context.textAlign = "center"; 
			context.textBaseline = "bottom";  //  GR_TEXT_VJUSTIFY_BOTTOM
			if (( direction == "U")||( direction == "D")) // Its a vertical line. 
			{
				context.translate(x1 - TXTMARGE,-(y1 + posy) / 2 );
				context.rotate(-Math.PI/2);
			}   
			if (( direction == "L")||( direction == "R")) // Its an horizontal line. 
			{	
				context.translate((x1 + posx) / 2,-(y1 - TXTMARGE) );
			}
		}
		context.fillText(name, 0,0);
		context.restore();
	}
	break
	
	default:
    alert("["+args[0]+"] - unknown letter in COMP//DRAW");
*/

	//this.iscale = 1;
	//this.originx = 0;
	//this.originy = 0;
	
}

  
   function radian(degrees){
      return degrees * Math.PI / 180;  
}

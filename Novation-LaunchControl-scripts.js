// Novation Launch Control script by Jesse French for Mixxx 2.1
// Enables LED feedback for Launch Control - set up for FX on decks 1 and 2
//
// Official programmer's reference guide to the hardware is available here and very useful:
// https://global.novationmusic.com/launch/launch-control/support-downloads

var LC = new Controller();
LC.byteArray = [];

// ---- User Settings: -------------------
LC.gb = 0; // global brightness - 0 is dim, 1 is medium, 2 is bright - pick the one you want
LC.myColor = 'amber'; // preferred default color of LED to use - choices are amber, red, green
LC.t = {u: 0x03, f: 0x09}; // template setting - user and factory

// Note: templates above are set to User Template 4 (index 3) and Factory Template 10 (index 9) because I don't have the 
// ability to run the device programming app, and that's what my hardware is set to. You can use 'mixxx --mididebug' 
// from command line to find your template settings - corresponds to incoming MIDI channel.
//
// ---- End User Settings ----------------


// pieces of the SysEx message to set LED values
LC.ledBytePart = [0xF0, 0x00, 0x20, 0x29, 0x02, 0x0A, 0x78]; // this part of the LED setting message does not vary
LC.led = { // this is the customizable part
	template: 0, 
	num: 0, 
	color: '',
	last: 0xF7,
	on: function (n, color, brightness, temp){
		// set some defaults if no arguments are provided - incorporates user settings
		n = n || 0;
		color = color || LC.myColor;
		brightness = brightness || LC.gb;
		temp = temp || LC.t.u;

		// set up the data
		this.num = n;
		this.color = getColor(color,brightness);
		this.template = temp;

		// assemble packet and send to device
		LC.byteArray = LC.ledBytePart.concat(LC.LEDtoArray());
		midi.sendSysexMsg(LC.byteArray, LC.byteArray.length);
	},
	off: function(num){
		this.on(num,'off');
	}
};

// LED color settings for the Launch Control - see programmer's guide for full explanation. b is a brightness control
function getColor(color,b){
	switch (color) {
		case 'off': return 0x0c;
		case 'red': return 0x0D+b;
		case 'amber': return 0x1D+b+b*16;
		case 'green': return 0x1C+b*16;
	}
}

// LED feedback for effects, using engine.makeConnection to bind to Mixxx controls
// here 'v' is a boolean value that corresponds to the effect on / off state in Mixxx
// the function at the end says: if the effect is enabled (v === true), then turn on the proper LED, otherwise turn it off

// deck 1:
var effects1 = engine.makeConnection('[EffectRack1_EffectUnit1_Effect1]','enabled',function (v){v ? LC.led.on(0) : LC.led.off(0)});
var effects2 = engine.makeConnection('[EffectRack1_EffectUnit1_Effect2]','enabled',function (v){v ? LC.led.on(1) : LC.led.off(1)});
var effects3 = engine.makeConnection('[EffectRack1_EffectUnit1_Effect3]','enabled',function (v){v ? LC.led.on(2) : LC.led.off(2)});
var effects4 = engine.makeConnection('[EffectRack1_EffectUnit3_Effect1]','enabled',function (v){v ? LC.led.on(3) : LC.led.off(3)});

//deck 2:
var effects5 = engine.makeConnection('[EffectRack1_EffectUnit2_Effect1]','enabled',function (v){v ? LC.led.on(4) : LC.led.off(4)});
var effects6 = engine.makeConnection('[EffectRack1_EffectUnit2_Effect2]','enabled',function (v){v ? LC.led.on(5) : LC.led.off(5)});
var effects7 = engine.makeConnection('[EffectRack1_EffectUnit2_Effect3]','enabled',function (v){v ? LC.led.on(6) : LC.led.off(6)});
var effects8 = engine.makeConnection('[EffectRack1_EffectUnit4_Effect1]','enabled',function (v){v ? LC.led.on(7) : LC.led.off(7)});

// LED feedback for FX headphone send, and FX assign on decks
var arrow1 = engine.makeConnection('[EffectRack1_EffectUnit1]','group_[Headphone]_enable',function (v){v ? LC.led.on(10,'',1) : LC.led.off(10)});
var arrow2 = engine.makeConnection('[EffectRack1_EffectUnit2]','group_[Headphone]_enable',function (v){v ? LC.led.on(8,'',1) : LC.led.off(8)});
var arrow3 = engine.makeConnection('[EffectRack1_EffectUnit1]','group_[Channel1]_enable',function (v){v ? LC.led.on(11,'',1) : LC.led.off(11)});
var arrow4 = engine.makeConnection('[EffectRack1_EffectUnit2]','group_[Channel2]_enable',function (v){v ? LC.led.on(9,'',1) : LC.led.off(9)});;


LC.LEDtoArray = function () { // can't use Object.values in this environment, so this is a kludge
	var array = [];
	array.push(LC.led.template);
	array.push(LC.led.num);
	array.push(LC.led.color);
	array.push(LC.led.last);
	return array;
}

LC.init = function (id, debugging) {
	// explicitly set device template
	var setTemplate = [240, 0, 32, 41, 2, 10, 119, LC.t.u, 247];
	midi.sendSysexMsg(setTemplate, setTemplate.length);
}
 
LC.shutdown = function() {
   // turn off all LEDs
   LC.led.color = LC.ledColor.off;
   for (var i = 0; i < 12; i++) {
   		LC.led.off(i);
    }
}
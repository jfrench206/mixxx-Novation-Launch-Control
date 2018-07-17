# mixxx-Novation-Launch-Control
Controller mapping file for the Novation Launch Control, enables LED feedback and control of effects.

## Installation
Copy both files into your Mixxx controllers directory - see here for folder location: https://www.mixxx.org/wiki/doku.php/controller_mapping_file_locations

## Documentation
The XML and JS files above allow you to control 4 audio effects per deck in Mixxx 2.1.

Physical set up: I have my controller turned 90 degrees to the right, so pad 1 is furthest away from me, and pad 8 is closest. The following description assumes you have your controller laid out in the same way.

Controlling effects:

- Pads 1-4 turn on/off effects 1-4 on Deck 1, and similarly with pads 5-8 for Deck 2. 
- The LED in each pad shows if the corresponding audio effect is on or off.
- Leftmost knob controls the meta knob for that effect, rightmost knob controls one effect parameter. You can change which parameter using the MIDI learning wizard within Mixxx.
- Super knob: leftmost knob for pad 1 and pad 5 have special powers - they are super knobs, so they control all the meta knobs for that deck.

Effects routing:

- The top two arrow keys control headphone send to effects (deck 1, deck 2)
- The lower two arrow keys send audio from each deck to the corresponding effects (deck 1 goes to FX1 and FX3, deck 2 goes to FX2 and FX4)
- LED feedback for all of the above

Info graphic coming soon! Also, I reckon I'll make a video explaining the functionality if I get enough requests. Create an issue if you want this!


## Gritty details
There is a "user settings" section near the beginning of the JS file that allows you to set global brightness and your choice of LED color for pads 1-8 (amber, red, green). The default is low brightness, amber LEDs.

The Launch Control has 2 templates (User and Factory) that are available from buttons on the unit. This mapping currently only uses the User template, so there's a whole second layer that can be set up with the MIDI learning wizard however you want. You'll have to set up LEDs for this part yourself though.

Note: in order to get the LED functionality working, you might need to set your template number in the JS file. To do this, launch Mixxx in MIDI debug mode from command line:

`mixxx --mididebug`

press some buttons on your Launch Control, and look to see what channel it is transmitting on. For instance, when I press pad 1, the console reads "Launch Control MIDI 1: t:2512 ms status 0x93 (ch 4, opcode 0x9), ctrl 0x09, val 0x7F" 

Find the "ch X" part, subtract 1 from that number, and edit the JS file - you want the line that says "LC.t = {u: 0x03, f: 0x09};" These numbers correspond to the MIDI channels that the device transmits on in User and Factory templates, so edit to match what your hardware is outputting.

If you have trouble, please create a new issue!

## Credits
Written by Jesse French

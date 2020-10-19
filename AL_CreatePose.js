/******************************** C R E A T E   P O S E  ***************************/
/*
Alexandre Cormier 
19/10/2020
www.alarigger.com
*/

function AL_createPose(){

	/*Rename subs and duplicate if wanted. 
	*/

	/***************** V A R I A B L E S */

	var selectedNodes = selection.numberOfNodesSelected(); 

	var curFrame = frame.current();

	var POSE_NAME = "unamed_pose";

	var numSelLayers = Timeline.numLayerSel;
	
	var DUPLICATE = false;
	
	var columns_to_treat = Array();
	
	var return_message ="";


	/**************** E X E C U T I O N */



	scene.beginUndoRedoAccum("AL_createPose");

	inputDialog()



	scene.endUndoRedoAccum();



	/**************** F U N C T I O N S */ 


	/*I N P U T   D I A L O G*/

	function inputDialog() {

		MessageLog.trace("inputDialog")

		   var d = new Dialog()
		   d.title = "Create_Pose";
		   d.width = 100;

		var nameInput = new LineEdit();
		nameInput.label = "Pose name : ";
		nameInput.maximum = 1000;
		nameInput.minimum = 1;
		d.add( nameInput );
		
		var dupliInput = new CheckBox();
		dupliInput.text = "duplicate sub ";
		
		d.add( dupliInput );


		if ( d.exec() ){

		 POSE_NAME = nameInput.text;
		 DUPLICATE = dupliInput.checked;
		 
		 if(fetch_and_check_columns()){
				if(treat_columns()){
					
				}else{
					MessageBox.warning(return_message);
				}
		 }else{
				MessageBox.warning(return_message);
		 }

		}


	}
	
	function Extract_drawingName(tvgname){
		
		var split0=tvgname.split('-');

		var split1=split0[1];
		
		var result = "";

		if(split1 != "" &&typeof(split1) == "string"){
			var split2 = split1.split('.')
			var  oldTiming= split2[0];	
			result = oldTiming;
		}
		return result;
	}

	function fetch_and_check_columns(){
		
		for ( var i = 0; i < numSelLayers; i++ ){

			if ( Timeline.selIsColumn(i)){
				
				MessageLog.trace(Timeline.selToNode(i));

				var currentColumn = Timeline.selToColumn(i);
				MessageLog.trace("currentColumn : "+currentColumn);

				if (column.type(currentColumn) == "DRAWING" && columns_to_treat.indexOf(currentColumn)==-1){

					
					var sub_timing = column.getDrawingTimings(currentColumn);
					var number_of_subs = sub_timing.length;
					
					for(var s=0; s<number_of_subs ;s++){
						
						var sub_name = Extract_drawingName(sub_timing[s])
						
						if(sub_timing[s] == POSE_NAME){

							return_message = "the pose name already exist in the selected drawings";
							return false;
							
						}

					}
					
					columns_to_treat.push(currentColumn);
					
				}
				

			}

		}		
		
		MessageLog.trace(columns_to_treat);
		
		return true
		
	}
	
	function check_input(char_input){
			
		
		
	}

	function treat_columns(){

		MessageLog.trace("\n===============Add_new_subtitutions")

		for ( var i = 0; i < columns_to_treat.length; i++ ){

				var currentColumn = columns_to_treat[i];
				MessageLog.trace("currentColumn : "+currentColumn);

				var sub_timing = column.getDrawingTimings(currentColumn);
				
				var number_of_subs = sub_timing.length;
				
				if(DUPLICATE){
					column.duplicateDrawingAt (currentColumn, curFrame)	;
						
				}
					
				var DrawingName =column.getDrawingName(currentColumn,curFrame)
	
				var oldTiming= Extract_drawingName(DrawingName)

				var newTiming = POSE_NAME; 
					
	

				if(column.renameDrawing(currentColumn, oldTiming,newTiming )) {

				}else{
					return_message = "unauthorised character in the pose name";
				}
				
				

		}
		
		return true;
		
	}
			
		

		


}

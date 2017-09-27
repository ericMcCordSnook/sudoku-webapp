var editingID = "";
$(document).ready(function(){
  createBoard();
  createSolveButton();
  createClearButton();
  createNumberPad();
  bindCellInteractions();
});

function createBoard() {
  var boardDiv = "<div id='board'></div>";
  $("body").append(boardDiv);
  var hDiv1 = "<div class='hdivider' style='top:33%'></div>";
  var hDiv2 = "<div class='hdivider' style='top:66%'></div>";
  var vDiv1 = "<div class='vdivider' style='left:33%'></div>";
  var vDiv2 = "<div class='vdivider' style='left:66%'></div>";
  $("#board").append(hDiv1, hDiv2, vDiv1, vDiv2);
  for(let r = 0; r < 9; r++) {
    for(let c = 0; c < 9; c++) {
      var newCell = "<div id='cellr"+r+"c"+c+"' class='cell' style='left:"+(1+c*11.1)+"%;top:"+(1+r*11.1)+"%'></div>";
      $("#board").append(newCell);
    }
  }
  $(document).click(function(){
    if(editingID != "") {
      $("#"+editingID).css("border","");
      $("#"+editingID).text("");
      $("#"+editingID).css("background-color","#7cacf9");
      editingID = "";
      closeNumPad();
    }
  });
}

function createSolveButton() {
  var solveButton = "<div id='solvebtn' style='z-index:0'>Solve it!</div>";
  $("body").append(solveButton);
  $("#solvebtn").hover(
    function(){$("#solvebtn").css({"box-shadow":"0 10px 20px 0 rgba(0,0,0,0.9)", "border":"2px solid yellow"});},
    function(){$("#solvebtn").css({"box-shadow": "0 5px 10px 0 rgba(0,0,0,0.9)", "border":""});}
  );
  $("#solvebtn").mousedown(function(){$("#solvebtn").css({"box-shadow": "0 5px 10px 0 rgba(0,0,0,0.9)", "border":""});});
  $("#solvebtn").mouseup(function(){
    $("#solvebtn").css({"box-shadow":"0 10px 20px 0 rgba(0,0,0,0.9)", "border":"2px solid yellow"});
    let result = getBoardArr();
    let boardArr = backtrackSolve(result["boardArr"], result["knownArr"]);
    setBoard(boardArr, false);
  });
}

function createClearButton() {
  var clearButton = "<div id='clearbtn'>Clear</div>";
  $("body").append(clearButton);
  $("#clearbtn").hover(
    function(){$("#clearbtn").css({"box-shadow":"0 10px 20px 0 rgba(0,0,0,0.9)", "border":"2px solid yellow"});},
    function(){$("#clearbtn").css({"box-shadow": "0 5px 10px 0 rgba(0,0,0,0.9)", "border":""});}
  );
  $("#clearbtn").mousedown(function(){$("#solvebtn").css({"box-shadow": "0 5px 10px 0 rgba(0,0,0,0.9)", "border":""});});
  $("#clearbtn").mouseup(function(){
    $("#clearbtn").css({"box-shadow":"0 10px 20px 0 rgba(0,0,0,0.9)", "border":"2px solid yellow"});
    let boardArr = [];
    setBoard(boardArr, true);
  });
}

function createNumberPad() {
  var numPad = "<div id='numpad'></div>";
  $("#board").append(numPad);
  for(let i = 0; i < 9; i++) {
    var newNumBtn = "<div id='numkey"+(i+1)+"' class='numkey' style='left:"+(10+80*(i%3))+"px;top:"+(10+80*Math.floor(i/3))+"px;'>"+(i+1)+"</div>";
    $("#numpad").append(newNumBtn);
  }
  $(".numkey").hover(
    function(e){$("#"+e.target.id).css({"box-shadow":"0 10px 20px 0 rgba(0,0,0,0.9)","border":"2px solid black"});},
    function(e){$("#"+e.target.id).css({"box-shadow":"0 5px 10px 0 rgba(0,0,0,0.9","border":""});}
  );
  $(".numkey").click(function(e){
    let num = $("#"+e.target.id).text();
    $("#"+editingID).text(num);
    $("#"+editingID).css("background-color","#f93b3b");
    closeNumPad();
    editingID = "";
    e.stopPropagation();
  });
}

function bindCellInteractions() {
  $(".cell").hover(
    function(e){ $("#"+e.target.id).css("border","2px solid blue");},
    function(e){ if(editingID != e.target.id){$("#"+e.target.id).css("border","");}}
  );
  $(".cell").click(function(e){
    if(editingID != "") {$("#"+editingID).css("border","");}
    editingID = e.target.id;
    $("#"+editingID).css("border","2px solid blue");
    openNumPad();
    e.stopPropagation();
  });
}

function openNumPad() {
  // open the pad centered at the center of the cell div for nice effect!
  $("#numpad").css({
    "width": "0px",
    "height":"0px",
  });
  $("#numpad").hide();
  let numpadSize = parseInt($("#numpad").css("width"));
  let openX = parseInt($("#"+editingID).css("left"))+22;
  let openY = parseInt($("#"+editingID).css("top"))+21;
  $("#numpad").css({"left":openX+"px", "top":openY+"px"});
  $("#numpad").show();
  $("#numpad").animate({
    width: "250px",
    height: "250px",
    left: "-=125px",
    top: "-=125px",
  }, 300);
}

function closeNumPad() {
  $("#numpad").animate({
    width: "0px",
    height: "0px",
    left: "+=125px",
    top: "+=125px",
  }, 300, function(){$("#numpad").hide();});
  if(editingID != "") {$("#"+editingID).css("border","");}
}

function getBoardArr() {
  let boardArr = [], knownArr = [];
  for(let r = 0; r < 9; r++) {
    let curRow = [], curRowKnown = [];
    for(let c = 0; c < 9; c++) {
      let curKnown = ($("#cellr"+r+"c"+c).text() == "") ? false : true;
      curRowKnown.push(curKnown);
      let curVal = curKnown ? parseInt($("#cellr"+r+"c"+c).text()) : 0;
      curRow.push(curVal);
    }
    boardArr.push(curRow);
    knownArr.push(curRowKnown);
  }
  return {"boardArr":boardArr,"knownArr":knownArr};
}


function setBoard(boardArr, clear) {
  if(clear) {
    for(let r = 0; r < 9; r++) {
      for(let c = 0; c < 9; c++) {
        $("#cellr"+r+"c"+c).animate({"background-color":"#7cacf9","color":"#7cacf9"}, function() {
          $("#cellr"+r+"c"+c).text("");
          $("#cellr"+r+"c"+c).css("color","#262626");
        });
      }
    }
  } else {
    for(let r = 0; r < 9; r++) {
      for(let c = 0; c < 9; c++) {
        if($("#cellr"+r+"c"+c).css("background-color") == "rgb(249, 59, 59)") {continue;}
        $("#cellr"+r+"c"+c).text(boardArr[r][c]).css("color","#7cacf9");
        $("#cellr"+r+"c"+c).animate({"color":"#262626"}, (500+100*(r+c)));
      }
    }
  }
}

function backtrackSolve(boardArr, knownArr) {
  // spotNum is a number representing where on the board we are
  // looking, starting at 0 as the upper left corner, and 80
  // as the lower right corner, since there 81 spots total
  let spotNum = 0;
  while(spotNum < 81) {
    let r = Math.floor(spotNum / 9);
    let c = spotNum % 9;
    if(knownArr[r][c]) {
      spotNum++;
      continue;
    }
    boardArr[r][c] = 1;
    while(boardArr[r][c] > 9 || !checkValidValueChange(boardArr, r, c)) {
      if(boardArr[r][c] < 9) {
        boardArr[r][c] = boardArr[r][c] + 1;
      } else {
        boardArr[r][c] = 0;
        do {
          spotNum--;
          if(spotNum == -1) {alert("No solution found!"); return boardArr;}
          r = Math.floor(spotNum / 9);
          c = spotNum % 9;
        } while(knownArr[r][c]);
        boardArr[r][c] = boardArr[r][c] + 1;
      }
    }
    spotNum++;
  }
  return boardArr;
}

function checkValidValueChange(boardArr, r, c) {
  let val = boardArr[r][c];

  // check row
  for(let i = 0; i < 9; i++) {
    if(i == c) {continue;}
    if(val == boardArr[r][i]) {return false;}
  }

  // check column
  for(let i = 0; i < 9; i++) {
    if(i == r) {continue;}
    if(val == boardArr[i][c]) {return false;}
  }

  // check subgrid
 let rInitial = r - (r % 3);
  let cInitial = c - (c % 3);
  for(let i = rInitial; i < rInitial + 3; i++) {
    for(let j = cInitial; j < cInitial + 3; j++) {
      if(i == r && j == c) {continue;}
      if(val == boardArr[i][j]) {return false;}
    }
  }

  // return true if all checks pass
  return true;
}

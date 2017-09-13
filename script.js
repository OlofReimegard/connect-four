var squaredArr = $(".square");
var gameMatrix = [];
var columnLength = 7;
var counter = 0;
var counterColumn = 0;
var tempArr = [];
var turn = "blue";
var bottom;
var curRow = 0;
var animating = false;

function fillMatrix() {
    if (counter < 43) {
        if (counterColumn < columnLength) {
            tempArr.push(squaredArr[counter]);
            counter++;
            counterColumn++;
        } else {
            for (var i = 0; i < tempArr.length; i++) {
                tempArr[i].classList.add(i);
            }
            gameMatrix.unshift(tempArr);
            tempArr = [];
            counterColumn = 0;
        }
        fillMatrix();
    }
}
fillMatrix();
$("#playingfield").on('click.game', function(e) {
    $(".winner").remove();
    if (e.target.className== "blue bluecolor"||e.target.className== "red redcolor"){
        return;
    }
    if(animating){
        return;
    }
    if (turn == "blue") {
        turn = "red";
        $("body").removeClass("red-background");
        $("body").addClass("blue-background");
    } else {
        turn = "blue";
        $("body").removeClass("blue-background");
        $("body").addClass("red-background");
    }
    var column = e.target.className;
    column = column.slice(7, 8);
    checkRow(column);
    animating = true;
    $(bottom[column]).html("<div class ='"+turn+"'></div>");
    $("<div class='temp top "+turn+"color'></div").prependTo("body");
    var offset = $(bottom[column]).offset();
    var temp = $(".temp");
    temp.css({"left" : offset.left , "top" : offset.top });
    setTimeout(function() {
        temp.css("transform" , "translate(-50%,-50%)");
    },10);
    setTimeout(function() {
        $(bottom[column]).children().addClass(turn+"color");
        temp.remove();
        animating = false;

    }, 710);

    var winner = checkWin();
    if (winner) {
        console.log(winner + " is the winner");
        // $("#playingfield").off("click.game");
        $("<div class='winner "+turn+"color'><h1>"+turn.toUpperCase()+" WINS</h1><h2 id ='replay'>PLAY AGAIN</h2></div").appendTo("body").hide().delay(710).fadeIn();
        $("#replay").on('click',function() {
            console.log("hello");
            for(var i = 0; i<squaredArr.length; i++){
                $(squaredArr[i]).children().removeClass("red");
                $(squaredArr[i]).children().removeClass("blue");
            }
            $(".winner").fadeOut(300);
        });
    }
});

function checkRow(num) {
    bottom = $(gameMatrix[curRow]);
    if ($(bottom[num]).children().hasClass("red") || $(bottom[num]).children().hasClass("blue")) {
        curRow++;
        checkRow(num);
    } else {
        curRow = 0;
        return;
    }
}



function checkWin() {
    var winner;

    function horizontal() {
        var inRow = 0;
        var rowNum = 0;
        var currRow = gameMatrix[rowNum];
        // console.log(currRow.length);
        var counter = 0;

        function goThroughRow() {
            currRow = gameMatrix[rowNum];
            if (rowNum > gameMatrix.length - 1) {
                return;
            }
            if (counter < currRow.length) {
                if ($(currRow[counter]).children().hasClass(turn)) {
                    inRow++;
                    counter++;
                    if (inRow >= 4) {
                        console.log("horizontal");
                        winner = turn;
                    } else {
                        goThroughRow();
                    }
                } else {
                    inRow = 0;
                    counter++;
                    goThroughRow();
                }
            } else {
                inRow=0;
                rowNum++;
                counter = 0;
                goThroughRow();

            }
        }
        goThroughRow();
    }

    function vertical() {
        var inRow = 0;
        var num = 0;

        function checkAgain() {
            inRow=0;
            var currColumn = $("." + num + "");
            for (var i = 0; i < currColumn.length; i++) {
                if ($(currColumn[i]).children().hasClass(turn)) {
                    inRow++;
                    if (inRow >= 4) {
                        console.log("vertical");
                        winner = turn;
                    }
                } else {
                    inRow = 0;
                    num++;
                    checkAgain();
                }

            }
        }
        
        checkAgain();
    }

    function diagonal() {
        var startLeft = 0;
        var startRight = 0;
        var inRow = 0;

        function inner() {
            if (startRight > 6) {
                startRight = 0;
                startLeft++;
            } else if (startLeft >= 3) {
                return;
            }
            var left = startLeft;
            var right = startRight;

            function innerInner() {

                if (left < 6 && right < 7) {
                    if ($((gameMatrix[left])[right]).children().hasClass(turn)) {
                        inRow++;
                        if (inRow >= 4) {
                            winner = turn;
                            return;
                        }
                        left++;
                        right++;
                        innerInner();
                    } else {
                        inRow = 0;
                        left++;
                        right++;
                        innerInner();
                    }
                } else {
                    inRow = 0;
                    startRight++;
                    inner();
                }
            }
            innerInner();
        }

        inner();
    }

    function diagonalTwo() {
        var startLeft = 5;
        var startRight = 6;
        var inRow = 0;

        function inner() {
            if (startRight < 0) {
                startRight = 6;
                startLeft--;
            } else if (startLeft < 3) {
                return;
            }
            var left = startLeft;
            var right = startRight;

            function innerInner() {
                if (left >= 0 && right < 7) {
                    if ($((gameMatrix[left])[right]).children().hasClass(turn)) {
                        inRow++;
                        if (inRow >= 4) {
                            console.log("d2");
                            console.log($((gameMatrix[left])[right]));
                            winner = turn;
                            return;
                        }
                        left--;
                        right++;
                        innerInner();
                    } else {
                        inRow = 0;
                        left--;
                        right++;
                        innerInner();
                    }
                } else {
                    inRow = 0;
                    startRight--;
                    inner();
                }
            }
            innerInner();
        }
        inner();
    }
    horizontal();
    vertical();
    diagonal();
    diagonalTwo();
    if (winner) {
        return winner;
    }
}

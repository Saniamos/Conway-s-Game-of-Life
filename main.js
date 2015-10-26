var main = angular.module("main", ['ngMaterial']);

main.controller("mainCtrl", function ($scope, $timeout) {
  'use strict';
  function maxX() {
    return Math.max.apply(null, 
      $scope.data.cur.map(function (e) { 
        return e.length;
      })
    )
  }

  function addBegEnd(obj, add) {
    var newList = [];
    newList[0] = add;
    Array.prototype.push.apply(newList, obj);
    newList.push(add);

    return newList;
  }

  $scope.cell = {
    dim: 70,
    calcSize: function() {
      var yLen = $scope.field.y();
      var winLen = document.body.clientHeight;
      if (winLen < yLen) {
        $scope.cell.dim = (winLen -20) / yLen * $scope.cell.dim;
      }
    }
  };

  $scope.field = {
    add: false,
    size: 5,
    x: function () {
      return maxX() * $scope.cell.dim;
    },
    y: function () {
      return $scope.data.cur.length * $scope.cell.dim;
    },
    marTop: function () {
      if (document.body.clientHeight > this.y()) {
        return ((document.body.clientHeight-(this.y()))/2)  + 'px';
      };
      return '10px'
    },
    marLeft: function () {
      if (document.body.clientWidth > this.x()) {
        return ((document.body.clientWidth-(this.x()))/2)  + 'px';
      };
      return '10px'
    },
    addCells: function () {
      if (!$scope.opt.fixedSize) {
        var empList = [];
        for (var i = 0; i < maxX(); i+=1) {
          empList.push(false);
        }
        
        var newList = addBegEnd($scope.data.cur, empList);

        for (var j = 0; j < newList.length; j+=1) {
          newList[j] = addBegEnd(newList[j], false);
        }
        $scope.data.cur = newList;
        $scope.cell.calcSize();
        $scope.field.size = Number($scope.field.size) + 2;
        if ($scope.cell.dim < Number($scope.opt.fixedSizeWhenCell) || $scope.field.size > $scope.opt.fixedSizeWhenSize) {
          $scope.opt.fixedSize = true;
        }
      }
    },
    userChange: function (i, j, val) {
      $scope.data.cur[i][j] = !val;
      $scope.data.alreadyRun = false; 
      $scope.opt.curCycle = 0;
      if (!val && getNeigValues(i, j).length < 8) {
        $scope.field.addCells();
        if ($scope.field.size > $scope.opt.fixedSizeWhenSize) {
          $scope.opt.fixedSizeWhenSize = $scope.field.size;
        }
      }
    }
  }

  $scope.createNew = function (x) {
    if (x < 1) {
      throw new Error('Please choose a higher Border')
    }
    var help = [];
    for (var i=0; i < x; i+=1) {
      help[i] = [];
      for (var n=0; n < x; n+=1) {
        help[i][n] = false;
      }
    }
    $scope.data.cur = help;
    $scope.opt.curCycle = 0;
    
    $scope.cell.calcSize();

    $scope.data.alreadyRun = false;
    angular.copy($scope.data.cur, $scope.data.old);
  }

  $scope.opt = {
    open: true,
    fixedSize: false,
    fixedSizeWhenCell: 21,
    fixedSizeWhenSize: 20,
    curCycle: 0,
    oldCycle: 0,
    time: 100,
    pauseOnOpen: true,
    running: false,
    playPause: function () {
      $scope.opt.running = !$scope.opt.running;
      if (!$scope.opt.running) {
        $scope.opt.run();
      } else {
        $scope.opt.stopp();
      }
    },
    runCycle: function (skip) {
      if (!skip) {
        $scope.opt.curCycle = Number($scope.opt.curCycle) + 1;
      }

      $scope.data.cur.forEach(function (r, i) {
        r.forEach(function (e, j) {
          $scope.data.cur[i][j] = lives(e, i, j);
        });
      });

      if ($scope.field.add) {
        $scope.field.addCells();
        $scope.field.add = false;
      }
    },
    run: function () {
      if (!$scope.data.alreadyRun) {
        $scope.data.alreadyRun = true;
        angular.copy($scope.data.cur, $scope.data.old);
      }
      $scope.opt.runPromise = $timeout(function () {$scope.opt.runCycle(false); $scope.opt.run();}, $scope.opt.time);
    },
    stopp: function () {
      $timeout.cancel($scope.opt.runPromise)
    },
    //Build worker for this:
    //Buggy as hell
    skipToCycle: function (num) {
      var start = $scope.opt.oldCycle;
      if (!$scope.data.alreadyRun) {
        $scope.data.alreadyRun = true;
        angular.copy($scope.data.cur, $scope.data.old);
        start = 0;
      }
      for (var i=start; i < num; i+=1) {
        $scope.opt.runCycle(true);
      }
      $scope.oldCycle = num;
    }
  };

  function getNeigValues(x, y) {
    var neighboursValues = [];

    function pushHelper(plus, e) {
      var helpCell = $scope.data.cur[x + e[0]*plus]; 
      if (helpCell !== undefined) {
        var helpCell2 = helpCell[y + e[1]*plus]
        if (helpCell2 !== undefined) {
          neighboursValues.push(helpCell2);
        }
      };
    }

    [[-1, 1], [-1, 0], [-1, -1], [0, 1]].forEach(function (e) {
      pushHelper(-1, e);
      pushHelper(1, e);
    });

    return neighboursValues;
  }

  function lives (state, x, y) {
    var neighboursValues = getNeigValues(x, y);

    var livNei = neighboursValues.filter(function(value) { return value }).length;
    var newState = (state ? (livNei <= 3 && livNei >= 2) : (livNei === 3));

    if (newState && neighboursValues.length < 8) {
      $scope.field.add = true;
    }

    return newState;
  }

  $scope.keydown = function (ev) {
    if (ev.which === 83) {
      $scope.opt.open = !$scope.opt.open;
      if ($scope.opt.pauseOnOpen) {
        if ($scope.opt.open) {
          $scope.opt.stopp();
        } else {
          $scope.opt.run();
        }
        $scope.opt.running = !$scope.opt.open;
      }
    }
  }

  $scope.mouseFlag = false;

  $scope.data = {
    cur: [[]],
    alreadyRun: false,
    old: [[]]
  };

  $scope.createNew($scope.field.size);
});
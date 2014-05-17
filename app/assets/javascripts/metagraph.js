Object.prototype.isEmpty = function() {
  return Object.keys(this).length === 0;
};

Array.prototype.findBy = function(type, value) {
  for (var i = 0; i < this.length; i++) {
    if(this[i][type]) {
      if (this[i][type] === value) {
        return this[i];
      }
      else {
        return {};
      }
    }
    else {
      return {};
    }
  }
};

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function overlap(el1, el2) {
  var condition = Math.sqrt( Math.pow((el1.x - el2.x), 2) + Math.pow((el1.y - el2.y),2)) > (2 * 20);
  return !condition;
}

function advancedOverlap(el1, el2) {
  var condition = Math.sqrt( Math.pow((el1.x - el2.x), 2) + Math.pow((el1.y - el2.y),2)) > (2 * 20 + 10);
  return !condition;
}

var url = window.location.pathname;
var metagraphId;

if(url.match(/metagraphs/)) {
  var metagraphId = url.substr(12);
}

var paper = new Raphael(document.getElementById('paper'), 1500, 1500);

$(document).ready(function(paper){
  // buildMetagraph(metagraphId);
  var els = [];
  // var m1 = new MetaElement(0,0,'m1');
  // var m2 = new MetaElement(0,0,'m2');
  // var v1 = new MetaElement(0,0,'v1');
  // var v2 = new MetaElement(0,0,'v2');
  // var v3 = new MetaElement(0,0,'v3');
  // var v4 = new MetaElement(0,0,'v4');

  for (var i = 0; i < 5; i++) {
    els.push(new MetaElement(0,0,'v' + i.toString()));
  }

  // m1.children = [v1,v2];
  // m2.children = [v2,v3,v4];
  // v1.parents = [m1];
  // v2.parents = [m1,m2];
  // v3.parents = [m2];
  // v4.parents = [m2];

  var lay = new Layer(50,50,els);
  // lay.drawCircle(550,550,290);
  lay.drawRect();
  lay.drawLayer();

});

function MetaElement(x, y, name) {
  this.x = x;
  this.y = y;
  this.radius = 20;
  this.hRadius = this.radius;
  this.name = name;
  this.isChecked = false;
  this.parents = [];
  this.children = [];

  this.hasParents = function() {
    return this.parents.length > 0;
  };

  this.hasChildren = function() {
    return this.children.length > 0;
  };

  this.set = function() {
    if (this.hasChildren()) {
      this.hRadius = ((this.children[0].radius + 20) * this.children.length) / 2;
      this.radius = this.hRadius / this.vertexLength * 1.5;
    }
    else {
      this.hRadius = 20;
      this.radius = 20;
    }
  };

  this.intersection = function() {
    if(this.hasParents()) {
      if(this.parents.length > 1) {
        return {
          intersection: this.parents,
          commomElement: this
        };
      }
      else {
        return {};
      }
    }
    else {
      return {};
    }
  };

  this.hasIntersection = function() {
    if(!this.intersection.isEmpty()) {
      return true;
    }
    else {
      return false;
    }
  };

  this.hasSameParentsWith = function(element) {
    return $(this.parents).filter(element.parents).length > 0;
  };

  this.isOverlap = function(element) {
    var condition = Math.sqrt( Math.pow((this.x - element.x), 2) + Math.pow((this.y - element.y), 2)) > (this.radius + element.radius);
    return !condition;
  };

  this.draw = function() {
    this.set();
    if (this.hasChildren()) {
      var ellipse = paper.ellipse(this.x, this.y, this.hRadius, this.radius);
      return ellipse;
    }
    else {
      var vertex = paper.set();
      var circle = paper.circle(this.x, this.y, this.radius);
      var text = paper.text(this.x, this.y, this.name).attr({'font-size': 12});
      vertex.push(circle);
      vertex.push(text);
      return vertex;
    }
  };
}

function Layer(x, y, elements) {
  this.x = x;
  this.y = y;
  this.elements = elements;
  this.intersections = [];

  this.swapElements = function(el1,el2) {
    var temp = el1;
    el1.x = el2.x;
    el1.y = el2.y;
    el2.x = temp.x;
    el2.y = temp.y;
  };

  this.intersections = function() {
    this.elements.forEach(function(el) {
      var intersections = [];
      if(el.hasIntersection()) {
        intersections.push(el.intersection());
      }
    });
  };

  this.getCommonElements = function() {
    var intersections = [];
    var array = this.elements;
    for(var i = 0; i < array.length; i++) {
      var current = array[i];
      for (var j = 0; j < array.length; j++) {
        if (i != j) {
          var common = $(current.children).filter(array[i].children);
          if(common.length > 0) {
            intersections.push({vertex: current.name, with:array[i].name, common: common});
          }
        }
      }
    }
    return intersections;
  };

  this.randomX = function(x, xMax) {
    return getRandomInt(x - xMax, x + xMax);
  };

  this.randomY = function(y, yMax) {
    return getRandomInt(y - yMax, y + yMax);
  };

  this.setInArea = function(x,y,radiusX,radiusY) {
    var coordinates = [{x:this.randomX(x, radiusX), y: this.randomY(y, radiusY)}];

    while(coordinates.length !== this.elements.length) {
      var candidate = {x:this.randomX(x, radiusX), y: this.randomY(y, radiusY)};
      var result = true;

      for (var i = 0; i < coordinates.length; i++) {
        if(advancedOverlap(coordinates[i], candidate)) {
          result &= false;
        }
      }

      if (result) {
        coordinates.push(candidate);
      }
      else {
        continue;
      }
    }

    for (var i = 0; i < coordinates.length; i++) {
      this.elements[i].x = coordinates[i].x;
      this.elements[i].y = coordinates[i].y;
    }
  };

  this.drawRect = function() {
    var rectangle = paper.rect(480,480, 220, 120);
  };

  // this.setCoordinates = function(){
  //   // var vertices = [];
  //   // var metavertices = [];
  //   //
  //   // this.elements.forEach(function(el){
  //   //   if(el.type === 'vertex') {
  //   //     vertices.push(el);
  //   //   }
  //   //   else {
  //   //     metavertices.push(el);
  //   //   }
  //   // });
  //   //
  //   // for (var i = 0; i < vertices.length; i++) {
  //   //     vertices[i].x = this.x - vertices[i].parentVertex.hRadius + 30 + i*60;
  //   //     vertices[i].y = this.y;
  //   // }
  //   // for (var i = 0; i < metavertices.length; i++) {
  //   //     metavertices[i].x = this.x + 30 + i*60;
  //   //     metavertices[i].y = this.y;
  //   // }
  //   // var array = this.elements;
  //   //
  //   // for (var i = 0; i < array.length; i++) {
  //   //   if(!array[i].hasChildren()) {
  //   //     array[i].x = this.x + i*60;
  //   //     array[i].y = this.y;
  //   //   }
  //   // }
  //   //
  //   // for (var i = 0; i < array.length; i++) {
  //   //   var current = array[i];
  //   //   console.log();
  //   //   if(current.hasChildren()) {
  //   //     var element = this.getCommonElements().findBy('name', current.name);
  //   //     for (var j = 0; j < array.length; j++) {
  //   //       if (i != j) {
  //   //         if(element['with'] === array[j].name) {
  //   //           var arr = element.common;
  //   //           var c
  //   //           current.x = element.common[0].x + current.hRadius;
  //   //           current.y = element.common[0].y;
  //   //         }
  //   //       }
  //   //     }
  //   //   }
  //   }

    // this.elements.forEach(function(el){
    //   if(el.hasParents()) {
    //
    //   }
    //   if(el.hasChildren()) {
    //
    //   }
    //
    // });



  this.drawLayer = function(){
    this.setInArea(600, 550, 100, 50);
    this.elements.forEach(function(el){
      el.draw();
    });
  };
}

// function Vertex(x, y, text) {
//   this.x = x,
//   this.y = y,
//   this.radius = 20,
//   this.hRadius = this.radius,
//   this.text = text,
//   this.isChecked = false,
//
//   this.drawVertex = function() {
//     var vertex = paper.set();
//     circle = paper.circle(this.x, this.y, this.radius);
//     text = paper.text(this.x, this.y, this.text).attr({'font-size': 12});
//     vertex.push(circle);
//     vertex.push(text);
//     return vertex;
//   }
// }
//
function Edge(v1,v2) {
  this.v1 = v1;
  this.v2 = v2;

  //FROM BOTTOM OF THE FIRST VERTEX TO THE TOP OF THE SECOND
  this.drawEdge = function() {
    var params = 'M ' + this.v1.x + ' ' + (this.v1.y + this.v1.radius) + ' L ' + this.v2.x + ' ' + (this.v2.y - this.v2.radius);
    var path = paper.path(params);
    path.attr({'arrow-end':'classic-wide-long', 'size':'5'});
    return path;
  };
}
//
// function Metavertex(x,y,name,vertices) {
//   this.vertices = vertices;
//   this.name = name;
//   this.x = x;
//   this.y = y;
//   this.radius = 20;
//   this.isChecked = false;
//
//   if (this.vertices.length == 1) {
//     this.hRadius = 20;
//   }
//   else {
//     this.hRadius = ((this.vertices[0].radius * 2 + 20) * this.vertices.length) / 2;
//   }
//
//   this.drawMetavertex = function() {
//     if(this.vertices.length == 1) {
//       this.vertices[0].x = this.x;
//       this.vertices[0].y = this.y;
//       this.vertices[0].drawVertex();
//     }
//     else {
//       this.radius = this.hRadius / this.vertices.length * 1.5;
//
//       for (var i = 0; i < this.vertices.length; i++) {
//         this.vertices[i].x = this.x - this.hRadius + 30 + i*60;
//         this.vertices[i].y = this.y;
//         this.vertices[i].drawVertex();
//       }
//
//       var ellipse = paper.ellipse(this.x, this.y, this.hRadius, this.radius);
//     }
//   }
// }

function buildMetagraph(id) {

  // $.getJSON("/metagraphs/" + id + ".json", function(data){
    var data = {
      "vertices": [
        {
          "name": "mv1",
          "vertices": [
            "v1",
            "v2"
          ]
        },
        {
          "name": "mv2",
          "vertices": [
            "v3"
          ]
        },
        {
          "name": "mv3",
          "vertices": [
            "v2",
            "v5"
          ]
        },
        {
          "name": "mv4",
          "vertices": [
            "v6"
          ]
        }
      ],
      "adjList": [
        {
          "parent": "mv1",
          "children": [
            "mv2"
          ]
        },
        {
          "parent": "mv3",
          "children": []
        },
        {
          "parent": "mv2",
          "children": [
            "mv4"
          ]
        }
      ]
    };

    var vertices = [];
    var adjList = [];

    for (var i = 0; i < data.vertices.length; i++) {
      v = [];
      for (var j = 0; j < data.vertices[i].vertices.length; j++) {
        v.push(new Vertex(0, 0, data.vertices[i].vertices[j]));
      }

      vertices.push(new Metavertex(0, 0, data.vertices[i].name, v));
    }

    for (var i = 0; i < data.adjList.length; i++) {
      verts = [];
      for (var j = 0; j < data.adjList[i].children.length; j++) {
        var v = findMetavertexByName(vertices, data.adjList[i].children[j]);
        verts.push(v);
      }
      var v = findMetavertexByName(vertices, data.adjList[i].parent);
      adjList.push({"parent": v, "children": verts});
    }

    drawMetagraph(paper, adjList);
  // });
}

function drawMetagraph(paper, adjList) {
  var edges = [];

  for (var j = 0; j < adjList.length; j++) {
    var current = adjList[j];

    if (!current.parent.isChecked) {
      current.parent.x = 200 + j*30;

      current.parent.y = 100;
      current.parent.drawMetavertex();
      current.parent.isChecked = true;
    }

    var left_shift = 0;
    if(current.children.length > 0) {
      for (var i = 0; i < current.children.length / 2; i++) {

        if (i == (Math.round(current.children.length / 2) - 1)) {
          left_shift += current.children[i].hRadius;
        }
        else {
          if (i == 0) {
            left_shift += current.children[i].hRadius + 20;
          }
          else {
            left_shift += 2*current.children[i].hRadius + 20;
          }
        }
      }

      var right_shift = 0;

      for (var i = current.children.length - 1; i >= current.children.length / 2; i--) {

        if (i == current.children.length - 1) {
          right_shift += current.children[i].hRadius;
        }
        else {
          if (i == (Math.round(current.children.length / 2) - 1)) {
            right_shift += current.children[i].hRadius + 20;
          }
          else {
            right_shift += 2*current.children[i].hRadius + 20;
          }
        }
      }

      if(current.children.length == 1) {
        if (!current.children[i].isChecked) {
          edges.push(new Edge(current.parent, current.children[0]));
          current.children[0].x = current.parent.x;
          current.children[0].y = current.parent.y + 100;
          current.children[0].drawMetavertex();
          current.children[0].isChecked = true;
        }
      }
      else {
        if (current.children.length % 2 != 0) {
          edges.push(new Edge(current.parent, current.children[0]));
          current.children[0].x = current.parent.x  - left_shift;
          current.children[0].y = current.parent.y + 100;
          current.children[0].drawMetavertex();
          current.children[0].isChecked = true;
          for (var i = 1; i < current.children.length; i++) {
            edges.push(new Edge(current.parent, current.children[i]));
            if (!current.children[i].isChecked) {
              current.children[i].x = current.children[i-1].x + (current.children[i-1].hRadius + current.children[i].hRadius + 20);
              current.children[i].y = current.parent.y + 100;
              current.children[i].drawMetavertex();
              current.children[i].isChecked = true;
            }
          }
        }
        else {
          current.children[0].x = current.parent.x  - left_shift - 20;
          current.children[0].y = current.parent.y + 100;
          current.children[0].drawMetavertex();
          current.children[0].isChecked = true;
          edges.push(new Edge(current.parent, current.children[0]));
          for (var i = 1; i < current.children.length / 2; i++) {
            edges.push(new Edge(current.parent, current.children[i]));
            if (!current.children[i].isChecked) {
              current.children[i].x =  current.children[i-1].x + (current.children[i-1].hRadius + current.children[i].hRadius + 20);
              current.children[i].y = current.parent.y + 100;
              current.children[i].drawMetavertex();
              current.children[i].isChecked = true;
            }
          }

          current.children[current.children.length - 1].x = current.parent.x  + right_shift + 20;
          current.children[current.children.length - 1].y = current.parent.y + 100;
          current.children[current.children.length - 1].drawMetavertex();
          current.children[current.children.length - 1].isChecked = true;
          edges.push(new Edge(current.parent, current.children[current.children.length - 1]));
          for (var i = current.children.length - 2; i >= current.children.length / 2; i--) {
            edges.push(new Edge(current.parent, current.children[i]));
            if (!current.children[i].isChecked) {
              current.children[i].x = current.children[i+1].x + (current.children[i+1].hRadius + current.children[i].hRadius + 20);
              current.children[i].y = current.parent.y + 100;
              current.children[i].drawMetavertex();
              current.children[i].isChecked = true;
            }
          }
        }
      }

    for (var i = 0; i < edges.length; i++) {
      edges[i].drawEdge();
    }
  }
  }



}

// function drawMetagraph(paper, adjList) {
//   var edges = [];
//
//   for (var j = 0; j < adjList.length; j++) {
//     current = adjList[j];
//
//     if (!current.parent.isChecked) {
//       current.parent.x = 200 + j*30;
//
//       current.parent.y = 100;
//       current.parent.drawMetavertex();
//       current.parent.isChecked = true;
//     }
//
//     var left_shift = 0;
//
//     for (var i = 0; i < current.children.length / 2; i++) {
//
//       if (i == (Math.round(current.children.length / 2) - 1)) {
//         left_shift += current.children[i].hRadius;
//       }
//       else {
//         if (i == 0) {
//           left_shift += current.children[i].hRadius + 20;
//         }
//         else {
//           left_shift += 2*current.children[i].hRadius + 20;
//         }
//       }
//     }
//
//     var right_shift = 0;
//
//     for (var i = current.children.length - 1; i >= current.children.length / 2; i--) {
//
//       if (i == current.children.length - 1) {
//         right_shift += current.children[i].hRadius;
//       }
//       else {
//         if (i == (Math.round(current.children.length / 2) - 1)) {
//           right_shift += current.children[i].hRadius + 20;
//         }
//         else {
//           right_shift += 2*current.children[i].hRadius + 20;
//         }
//       }
//     }
//
//     if(current.children.length == 1) {
//       if (!current.children[i].isChecked) {
//         edges.push(new Edge(current.parent, current.children[0]));
//         current.children[0].x = current.parent.x;
//         current.children[0].y = current.parent.y + 100;
//         current.children[0].drawMetavertex();
//         current.children[0].isChecked = true;
//       }
//     }
//     else {
//       if (current.children.length % 2 != 0) {
//         edges.push(new Edge(current.parent, current.children[0]));
//         current.children[0].x = current.parent.x  - left_shift;
//         current.children[0].y = current.parent.y + 100;
//         current.children[0].drawMetavertex();
//         current.children[0].isChecked = true;
//         for (var i = 1; i < current.children.length; i++) {
//           edges.push(new Edge(current.parent, current.children[i]));
//           if (!current.children[i].isChecked) {
//             current.children[i].x = current.children[i-1].x + (current.children[i-1].hRadius + current.children[i].hRadius + 20);
//             current.children[i].y = current.parent.y + 100;
//             current.children[i].drawMetavertex();
//             current.children[i].isChecked = true;
//           }
//         }
//       }
//       else {
//         current.children[0].x = current.parent.x  - left_shift - 20;
//         current.children[0].y = current.parent.y + 100;
//         current.children[0].drawMetavertex();
//         current.children[0].isChecked = true;
//         edges.push(new Edge(current.parent, current.children[0]));
//         for (var i = 1; i < current.children.length / 2; i++) {
//           edges.push(new Edge(current.parent, current.children[i]));
//           if (!current.children[i].isChecked) {
//             current.children[i].x =  current.children[i-1].x + (current.children[i-1].hRadius + current.children[i].hRadius + 20);
//             current.children[i].y = current.parent.y + 100;
//             current.children[i].drawMetavertex();
//             current.children[i].isChecked = true;
//           }
//         }
//
//         current.children[current.children.length - 1].x = current.parent.x  + right_shift + 20;
//         current.children[current.children.length - 1].y = current.parent.y + 100;
//         current.children[current.children.length - 1].drawMetavertex();
//         current.children[current.children.length - 1].isChecked = true;
//         edges.push(new Edge(current.parent, current.children[current.children.length - 1]));
//         for (var i = current.children.length - 2; i >= current.children.length / 2; i--) {
//           edges.push(new Edge(current.parent, current.children[i]));
//           if (!current.children[i].isChecked) {
//             current.children[i].x = current.children[i+1].x + (current.children[i+1].hRadius + current.children[i].hRadius + 20);
//             current.children[i].y = current.parent.y + 100;
//             current.children[i].drawMetavertex();
//             current.children[i].isChecked = true;
//           }
//         }
//       }
//     }
//   }
//
//   for (var i = 0; i < edges.length; i++) {
//     edges[i].drawEdge();
//   }
// }

var url = window.location.pathname;
var metagraphId;

if(url.match(/metagraphs/)) {
  var metagraphId = url.substr(12);
}

var paper = new Raphael(document.getElementById('paper'), 700, 700);

$(document).ready(function(paper){
  buildMetagraph(metagraphId);
});

function findByName(source, name) {
  for (var i = 0; i < source.length; i++) {
    if (source[i].text === name) {
      return source[i];
    }
  }
}

function findMetavertexByName(source, name) {
  for (var i = 0; i < source.length; i++) {
    if (source[i].name === name) {
      return source[i];
    }
  }
}

function Vertex(x, y, text) {
  this.x = x,
  this.y = y,
  this.radius = 20,
  this.hRadius = this.radius,
  this.text = text,
  this.isChecked = false,

  this.drawVertex = function() {
    var vertex = paper.set();
    circle = paper.circle(this.x, this.y, this.radius);
    text = paper.text(this.x, this.y, this.text).attr({'font-size': 12});
    vertex.push(circle);
    vertex.push(text);
    return vertex;
  }
}

function Edge(v1,v2) {
  this.v1 = v1,
  this.v2 = v2,

  //FROM BOTTOM OF THE FIRST VERTEX TO THE TOP OF THE SECOND
  this.drawEdge = function() {
    var params = 'M ' + this.v1.x + ' ' + (this.v1.y + this.v1.radius) + ' L ' + this.v2.x + ' ' + (this.v2.y - this.v2.radius);
    var path = paper.path(params);
    path.attr({'arrow-end':'classic-wide-long', 'size':'5'});
    return path;
  }
}

function Metavertex(x,y,name,vertices) {
  this.vertices = vertices;
  this.name = name;
  this.x = x;
  this.y = y;
  this.radius = 20;
  this.isChecked = false;

  if (this.vertices.length == 1) {
    this.hRadius = 20;
  }
  else {
    this.hRadius = ((this.vertices[0].radius * 2 + 20) * this.vertices.length) / 2;
  }

  this.drawMetavertex = function() {
    if(this.vertices.length == 1) {
      this.vertices[0].x = this.x;
      this.vertices[0].y = this.y;
      this.vertices[0].drawVertex();
    }
    else {
      this.radius = this.hRadius / this.vertices.length * 1.5;

      for (var i = 0; i < this.vertices.length; i++) {
        this.vertices[i].x = this.x - this.hRadius + 30 + i*60;
        this.vertices[i].y = this.y;
        this.vertices[i].drawVertex();
      }

      var ellipse = paper.ellipse(this.x, this.y, this.hRadius, this.radius);
    }
  }
}

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
    current = adjList[j];

    if (!current.parent.isChecked) {
      current.parent.x = 200 + j*30;

      current.parent.y = 100;
      current.parent.drawMetavertex();
      current.parent.isChecked = true;
    }

    var left_shift = 0;

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
  }

  for (var i = 0; i < edges.length; i++) {
    edges[i].drawEdge();
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

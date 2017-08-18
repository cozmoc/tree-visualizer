import { Component, OnInit } from '@angular/core';
import { DataStoreService } from '../data-store.service'
import {Router} from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

declare var _,d3;
@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.css'],
  providers:[DataStoreService]
})

export class VisualizerComponent implements OnInit {
	public data:any;
	
  constructor(private domSanitizer:DomSanitizer,private router:Router,private DataStore:DataStoreService) {
  	//this._ = window._;
  }
  ngOnInit() {
  	this.DataStore.getLocalData((d)=>{
  		if(d){
  			this.data = d;
  			this.draw();
  		}else{
  			this.router.navigateByUrl('/');
  		}
		});
  }

  goBack(){
  	this.router.navigateByUrl('/');
  }

  export(){
  	return this.domSanitizer.bypassSecurityTrustResourceUrl("data:application/json,"+encodeURIComponent(JSON.stringify(this.data.data)));
  }
  draw(){
		var title = JSON.parse(JSON.stringify(this.data.data.tree_title));
		var data = JSON.parse(JSON.stringify(this.data.data.tree_nodes));
		_.each(data, function (o) {
		  o.name = o.title;
		  delete o.title;
		  if(o.next_node_id) _.findWhere(data, {id: o.next_node_id}).parent = o.id;
		});
		_.each(data, function (o) {
		  if(_.findWhere(data, {previous_sibling_id: o.id})) _.findWhere(data, {previous_sibling_id: o.id}).parent = o.parent;
		});
		var idToNodeMap = {};
		var root = null,parentNode;
		data.forEach(function(datum) {
		  datum.children = [];
		  idToNodeMap[datum.id] = datum;
		  if(typeof datum.parent === "undefined") {
		    root = datum;        
		  } else {        
		    parentNode = idToNodeMap[datum.parent];
		    delete datum.parent;
		    parentNode.children.push(datum);        
		  }
		});
		var last = data[0].id;
		for (var i = 1; i < data.length; i++) {
		  if(data[i].previous_sibling_id == last){
		    last = data[i].id;
		  }else{
		    data.splice(i,1);
		    i--;
		  }
		}

		data = {name:title,children:data};
		var margin = {top: 20, right: 120, bottom: 20, left: 120},
		  width = 960 - margin.right - margin.left,
		  height = 500 - margin.top - margin.bottom;
		  
		var i = 0,
		  duration = 750,
		  root;

		var tree = d3.layout.tree()
		  .size([height, width]);

		var diagonal = d3.svg.diagonal()
		  .projection(function(d) { return [d.y, d.x]; });

		var svg = d3.select("svg")
		  .attr("width", width + margin.right + margin.left)
		  .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		root = data;
		root.x0 = height / 2;
		root.y0 = 0;
		  
		update(root);

		d3.select(self.frameElement).style("height", "500px");

		function update(source) {

		  // Compute the new tree layout.
		  var nodes = tree.nodes(root).reverse(),
		    links = tree.links(nodes);

		  // Normalize for fixed-depth.
		  nodes.forEach(function(d) { d.y = d.depth * 180; });

		  // Update the nodes…
		  var node = svg.selectAll("g.node")
		    .data(nodes, function(d) { return d.id || (d.id = ++i); });

		  // Enter any new nodes at the parent's previous position.
		  var nodeEnter = node.enter().append("g")
		    .attr("class", "node")
		    .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
		    .on("click", click);

		  nodeEnter.append("circle")
		    .attr("r", 1e-6)
		    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

		  nodeEnter.append("text")
		    .attr("class", "text1")
		    .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
		    .attr("dy", ".35em")
		    .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
		    .text(function(d) { return d.name; })
		    .style("fill-opacity", 1e-6);
		    // nodeEnter.append("rect")
		    // .attr("x", function(d) { return d.children || d._children ? -15 : 15; })
		    // .attr("dy", "-2em")
		    // .attr("width", "100px")
		    // .attr("height", "100px")
		    // .style("fill", "red");
		    
		  nodeEnter.append("text")
		    .attr("class", "text2")
		    .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
		    .attr("dy", "2em")
		    .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
		    .text(function(d) { return "ID: "+d.id; })
		    .style("fill-opacity", 1e-6);
		  // Transition nodes to their new position.
		  var nodeUpdate = node.transition()
		    .duration(duration)
		    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

		  nodeUpdate.select("circle")
		    .attr("r", 10)
		    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

		  nodeUpdate.select(".text1")
		    .style("fill-opacity", 1);
		  nodeUpdate.select(".text2")
		    .style("fill-opacity", 1);
		    

		  // Transition exiting nodes to the parent's new position.
		  var nodeExit = node.exit().transition()
		    .duration(duration)
		    .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
		    .remove();

		  nodeExit.select("circle")
		    .attr("r", 1e-6);

		  nodeExit.select("text")
		    .style("fill-opacity", 1e-6);

		  // Update the links…
		  var link = svg.selectAll("path.link")
		    .data(links, function(d) { return d.target.id; });

		  // Enter any new links at the parent's previous position.
		  link.enter().insert("path", "g")
		    .attr("class", "link")
		    .attr("d", function(d) {
		    var o = {x: source.x0, y: source.y0};
		    return diagonal({source: o, target: o});
		    });

		  // Transition links to their new position.
		  link.transition()
		    .duration(duration)
		    .attr("d", diagonal);

		  // Transition exiting nodes to the parent's new position.
		  link.exit().transition()
		    .duration(duration)
		    .attr("d", function(d) {
		    var o = {x: source.x, y: source.y};
		    return diagonal({source: o, target: o});
		    })
		    .remove();

		  // Stash the old positions for transition.
		  nodes.forEach(function(d) {
		  d.x0 = d.x;
		  d.y0 = d.y;
		  });
		}

		// Toggle children on click.
		function click(d) {
		  if (d.children) {
		  d._children = d.children;
		  d.children = null;
		  } else {
		  d.children = d._children;
		  d._children = null;
		  }
		  update(d);
		}

  }
}

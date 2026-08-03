import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as joint from '@joint/core';

@Component({
  selector: 'app-event-mapper',
  standalone: true,
  imports: [],
  templateUrl: './event-mapper.html',
  styleUrl: './event-mapper.css'
})
export class EventMapper implements AfterViewInit {
  @ViewChild('paperContainer', { static: true })
  paperContainer!: ElementRef;

  ngAfterViewInit(): void {
    const graph = new joint.dia.Graph();

    new joint.dia.Paper({
      el: this.paperContainer.nativeElement,
      model: graph,
      width: '100%',
      height: 700,
      gridSize: 10,
      drawGrid: true,
      interactive: false, // static chart - dragging breaks the manual alignment
      background: { color: '#f8f9fa' }
    });

    // ---- Layout constants ----
    const parentW = 170, parentH = 60;
    const leafW = 130, leafH = 60;

    const loginX = 450;
    const user1X = 150, user2X = 450, user3X = 750;
    const userY = 180;
    const leafY = 350;
    const busY1 = 120;   // login -> users bus
    const busY2 = 290;   // user -> name/role bus

    // ---- Login ----
    const login = this.createBox(graph, loginX, 50, parentW, parentH, 'Login', '#2196F3', '#1976D2');

    // ---- Users ----
    const user1 = this.createBox(graph, user1X, userY, parentW, parentH, 'User1', '#4CAF50', '#388E3C');
    const user2 = this.createBox(graph, user2X, userY, parentW, parentH, 'User2', '#4CAF50', '#388E3C');
    const user3 = this.createBox(graph, user3X, userY, parentW, parentH, 'User3', '#4CAF50', '#388E3C');

    this.createTreeLink(graph, login, user1, busY1);
    this.createTreeLink(graph, login, user2, busY1);
    this.createTreeLink(graph, login, user3, busY1);

    // ---- Leaf helper: places Name/Role touching, centered under parent ----
    const addLeafPair = (parent: joint.dia.Element, parentCenterX: number) => {
      const name = this.createBox(graph, parentCenterX - leafW, leafY, leafW, leafH, 'Name', '#FF9800', '#E65100');
      const role = this.createBox(graph, parentCenterX, leafY, leafW, leafH, 'Role', '#9C27B0', '#6A1B9A');
      this.createTreeLink(graph, parent, name, busY2);
      this.createTreeLink(graph, parent, role, busY2);
    };

    addLeafPair(user1, user1X + parentW / 2);
    addLeafPair(user2, user2X + parentW / 2);
    addLeafPair(user3, user3X + parentW / 2);
  }

  // Create Box
  createBox(
    graph: joint.dia.Graph,
    x: number,
    y: number,
    w: number,
    h: number,
    text: string,
    fill: string,
    stroke: string
  ) {
    const box = new joint.shapes.standard.Rectangle();
    box.position(x, y);
    box.resize(w, h);

    box.attr({
      body: { fill, stroke, rx: 8, ry: 8 },
      label: { text, fill: '#fff', fontSize: 16, fontWeight: 'bold' }
    });

    box.addTo(graph);
    return box;
  }

  // Create Connection (auto-computes center, works for any box width)
 createTreeLink(
    graph: joint.dia.Graph,
    source: joint.dia.Element,
    target: joint.dia.Element,
    midY: number
  ) {
    const link = new joint.shapes.standard.Link();

    link.source(source);
    link.target(target);

    const sourceCenterX = source.position().x + source.size().width / 2;
    const targetCenterX = target.position().x + target.size().width / 2;

    link.vertices([
      { x: sourceCenterX, y: midY },
      { x: targetCenterX, y: midY }
    ]);

    link.attr({
      line: {
        stroke: '#555',
        strokeWidth: 2,
        targetMarker: { type: 'path', d: 'M 10 -5 0 0 10 5 z' }
      }
    });

    link.router('normal');
    link.connector('rounded', { radius: 6 });

    link.addTo(graph);
    return link;
  }} 
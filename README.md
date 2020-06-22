# AIS PLTR

A AIS Chartplotter for display positions and tracks of vessels. Frontend for AIS-PLTR-SRV.

Visit https://blog.3epnm.de/ for more Details and https://ais.3epnm.de/ for a demo

## About
AIS-PLTR is intended to be the simplest possible AIS chart plotter where ship positions can be displayed. The development was done with TypeScript and LeafletJS as Map API and MaterialUI Web as layout library. No other front end frameworks were used.

### Installation
The installation is done by clone the project repository and installing the dependencies.
```
git clone https://github.com/3epnm/ais-pltr
cd ais-pltr
npm install
```
AIS-PLTR uses webpack to bundle the source files. `npm start` can be called to run the development server or `npm run build` to build a bundle of the application. The resulting dist folder within the project directory can then be served via a webserver, eg. nginx. At the end of this article, a example for a possible nginx configuration is given.

### Features
The application only covers to the area of the Port of Hamburg. Usually there are no more than 370 ships in the port of Hamburg, so that each of these ships can be renewed in real time without getting into performance problems. The range of features is limited, but allows interesting things to be observed in the port of Hamburg. In addition to a table of all ships, a detailed view of the ship parameters and a table of all ship positions of the last hour, the user can display and record the positions track for up to 8 ships.

#### The Map
The center of the application is a map on which the ship positions are rendered. The red dot indicates the mounting position ofthe AIS transceiver. Unfortunately, not all ships report the exact direction in which the bow is pointing. In this case, the ships are shown as a simple marker when they are not moving and this information cannot be derived from the course of the ship.

![Arrival area of the port ferries at Hamburg Landungsbrücken](https://3epnm.de/image/efbe8f618164441d3d17bf9bb243b713?width=400)

#### The Ship Table
The Ship table can be opened via the main menu drawer. The latter is shown if the user activates the menu icon in the top, left corner. If a ship in this table has updates, the corresponding row is animated. The table can be sorted if the user clicks on a column header. On the top right of the ship table a search field is located, where the table can be filtered by name, type or MMSI of a ship. A function, where the table can be filtered by port ferries can be found left from the search field. A click on a row centers the map to the current position of the selected vessel.

![The ship table filtered by port ferries](https://3epnm.de/image/f9d6c96e2e14a4fcd4c2e8d3b4204965?width=400)

#### Vessel Detail Views
If the User clicks on a ship marker, a popup with some details about the ship is shown as well as a ship image, if a free to use image is available. The popup offers a more detailed view to see all up-to-date AIS Details. When clicked on the Details button, a modal with two tabs is shown. The first tab, `Ship Data`, shows static and voyage related data. The second tab, `Position`, shows the current position report. The fields are updated, if changes occur.

![The port ferry Altenwerder underway](https://3epnm.de/image/85c4684b78de4168f7f8f87b35896bca?width=400)

#### Positions Table and Position Lock
The position table can be opened via the `Positions` button of the ship popup. In the position table, the history of positions can be viewed where the most recent report is displayed on top. The table is updated if a new position report occurs. The user can use the `Lock` function found in the top right corner of the position table to automatically re-center the map to the most recent position of the selected ship if it moves.

![Position table for port ferry Oortkaten](https://3epnm.de/image/98651f165dbd84dba632ec98d3e3bab5?width=400)

#### Track Rendering
The user can create up to eight track recordings. The last button in the detail popup, labeled `Track`, enables or disables a position recording for a ship. By default, the track of positions for the last hour is displayed. This can be enabled or disabled with the `Load Track History` button from the main menu.

#### Additional functions
Some additional functions are located on the right side of the title bar. With the `+` and `-` button zoom the view in or out. The lock icon releases the position lock without having to open the position table of the ship in question. The bookmark icon before the help icon opens a list of regions, to which the map will zoom/pan if an entry is clicked. The last icon opens the help function, where the user can learn about the main features of this application.

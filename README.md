# AIS PLTR

A AIS Chartplotter for display positions and tracks of vessels. Frontend for AIS-PLTR-SRV.

Visit https://blog.3epnm.de/ for more Details and https://ais.3epnm.de/ for a Demo

## About

The aim was to develop the simplest possible AIS chart plotter in which ship positions can be displayed. The development was done with TypeScript and LeafletJS as Map API and MaterialUI Web as Layout Library. No other front end frameworks were used.

The display is limited to the area of the Port of Hamburg. As a rule, there are no more than 370 ships in the port of Hamburg, so that each of these ships can be renewed in real time without getting into performance problems.

The range of features is limited, but allows interesting things to be observed in the port of Hamburg. In addition to a table of all ships in the port of Hamburg, a detailed view of the ship parameters and a table of all ship positions of the last hour, the user can display and record the positions track for up to 8 ships.

## The Map
The center of the application is a map on which the ship positions are drawn. With the Position and Static Data Reports a ship symbol can be rendered. The red dot indicates the position where the the AIS transceiver is mounted on the ship. Unfortunately, not all ships report the exact direction in which the bow is pointing. In this case, the ships are shown as a simple marker when they are not moving and this information cannot be derived from the course of the ship.

## The Ship Table
In the table of all ships in the harbour you can search for certain ships or filter by ship type. The Ship table can be opend via the main menu drawer. The later is shown if the user activates the menu icon in the top, left corner. If a ship in this table has updates, the corresponding row is animated. The table can be sorted if the user clicks on a column header. On the top right of the ship table a search field is located, where the table can be filter by name, type or MMSI of a ship. A function, where the table can be filter by port ferries can be found left from the search field. A click on a row centers the map to the current position of selected vessel.

## Vessel Detail Views
If the User clicks on a ship marker, a popup with some details about the ship is shown. Sometimes a Ship Image is shown, if a free to use image can be found. From Here, a more detailed View can be opened to see all up-to-date AIS Details. When clicked on the Details Button, a modal with two tabs is shown. The first tab, Ship Data, shows Static and Voyage Related Data for the ship. The second tab, Position, shows the current position report for a ship. The fields are updated, if changes occur. Unfortunately it is not yet possible to allow the user to add new ship pictures. This is planned for a future version. The two more buttons, Track and Positions are topic of the following paragraphs.

## Positions Table and Position Lock
The position table can be opened from the ship popup if the position button is clicked. In the position table the history of the positions of a ship can be viewed, new positions are added from above, so that the most recent report is display on top. If a ship is always to be shown centered on the map, the Lock Button found in the top right corner of the position table can be used to set the position as the center of the map. If the ship is moving, the map is re-centered to the most recent position. The position lock can be released with a click on the unlock button, top right of the positions table, or with a click on the locked symbol on the right side of the title bar.

## Track Rendering
The main feature is the option, to create up to eight track recordings. The last button in the ship detail popup ist labeled Track. With this button the track recording for a ship can be enabled or disabled. By default, the track of positions for the last hour is displayed. This can be enabled or disabled with the Load Track History button from the main menu.
The following screen recording illustrates this functionality. The position of the biggest ship of the three is locked. The other two ships are tugs which support the cargo ship while moving. The track history is turned off.
If the max number of Tracks is reached, a popup is shown, where the user can remove a recording to make space for a new track recording. This popup is also available over the track collection button from the main menu.

## Additional functions
Some additional functions are located on the right side of the title bar. With the plus and minus buttons, the view can be zoomed in or out. As already mentioned, the lock can be used to release the position lock without having to open the position table of the ship in question. The bookmark icon before the help icon opens a list off regions, to which the map will zoom/pan if a entry is clicked. The last icon open the help function, where the user can learn about the main features of this application.


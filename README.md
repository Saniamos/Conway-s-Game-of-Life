# Conway-s-Game-of-Life

IMPORTANT: 
The current version is NOT finished, nor working completly correct, since there somewhere seems to be a bug

This is the implemantation lying in my workspace folder wanting to be finalized, so i decided to add it here. 
The mentioned bug needs to be fixed and there are still some things missing e.g. I defentely want to make the skip to lifecycle funciton work and the code needs comments for better understanding.

I recommend not to change the values during simulation, because it sometimes deletes some parts of your simulation, but try and error and you'll knwo what works and what doesn't.
Please keep in Mind that the simulation runs on your computer and in your browser, so the more cells the more laggy it might be. To counter that try a higher time between cycles and vice versa.


To open the options again press s
To close press s or click on some other point than the sidebar
You have an option to pause the game, when opening the sidebar
The Boardsize is the number of cells on x and y axis
You can change the size of the cells with the slider. The number is measured in px
If you check the "fixed size" box the board will not grow if the cells need more space otherwise the conditions apply. 
  Conditions are:
    1. Boardsize is over smth.
    2. Cells are smaller than x px
You can also specify the time between cycleinvokations. So after x ms start the new cycle.

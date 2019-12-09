var xSlider = document.getElementById("xSlider");
xSlider.oninput = function() 
{
    color.x = this.value;
}

var ySlider = document.getElementById("ySlider");
ySlider.oninput = function() 
{
    color.y = this.value;
}

var zSlider = document.getElementById("zSlider");
zSlider.oninput = function() 
{
    color.z = this.value;
}

var rotx = document.getElementById("rotx");
rotx.oninput = function()
{
    rot.x = this.value;
}

var roty = document.getElementById("roty");
roty.oninput = function()
{
    rot.y = this.value;
}

var rotz = document.getElementById("rotz");
rotz.oninput = function()
{
    rot.z = this.value;
}

var polygonViewCheckbox = document.getElementById("polygons");
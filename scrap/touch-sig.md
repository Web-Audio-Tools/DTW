# Touch signature identification with JavaScript

Jul 16, 2016[JavaScript](https://gordonlesti.com/tag/javascript/ "Tag JavaScript")

The [uWave: Accelerometer-based Gesture Recognition](http://www.ruf.rice.edu/~mobile/project_uwave.html "Rice Efficient Computing Group: Tempo Mobile Browser Speed") project from the [Rice Efficient Computing Group](http://www.ruf.rice.edu/~mobile/ "Rice Efficient Computing Group") inspired me to build a small real time HTML based signature identification with JavaScript. Actually gestures have not that much incommon with drawn handwriting, but I wanted to test [dynamic-time-warping](https://github.com/GordonLesti/dynamic-time-warping "GordonLesti/dynamic-time-warping: Dynamic time warping for JavaScript") on signatures. I am not sure if there is a real usecase for a signature identification in web applications, but it was fun to build this kind of prototyp. Feedback is welcome.

## Signature experiment

This small application is not designed and coded best practice. I'm also working on the paramters and the algorithm to improve this tool.

Please note this small application tries to identify just simple signatures. The path, the speed and the size of the drawn signature are very important. For example a circle clockwise is not the same as a circle anticlockwise.

### Course of the experiment

I guess the tool works best on a tablet device, but also on desktop with a mouse. The usability on smartphones is not that good, but that works also.

Just make your signature, any symbol or an other doodle on the first square *(violet)*. Afterwards try to draw the same thing again on the second square *(cyan)*. A simple example to start is a triangle for example. There is a maximum pause of one second between strokes in the signature. The application will think it is beginning a new signature if the pause between strokes is longer than one second.

Signature 1

Signature 2

## How does that work?

The following explanation will ignore the painting from the signatures on canvas. More important are the data preparation and evaluation.

### Recording the touch and mouse movement

First we are recording the touch with the events `touchstart`, `touchmove` and `touchend` or the mouse movements with `mousedown`, `mousemove` and `mouseup`. Important are the `x` and the `y` coordinates of the events relative to the left upper corner of the green rectangle. The signature is finished if the user stops painting for more than 1 second between strokes.

### Normalizing the signatures

We need to normalize the signatures to making sure that a signature in the left upper corner is the same as a signature in the right corner. We just collect all `x` values of a signature and calculate the average value. Every `x` value in the signature will be reduced by this average value. We do the same with the `y` values.

```
// data is an array of arrays with the x coordinate in 0 and y in 1
function prepareSignature(data) {
    var xMean = 0;
    var yMean = 0;
    var diffData = [];
    for (var i = 0; i < data.length; i++) {
        xMean = xMean + data[i][0];
        yMean = yMean + data[i][1];
    }
    xMean = xMean / data.length;
    yMean = yMean / data.length;
    for (var i = 0; i < data.length; i++) {
        diffData[i] = [data[i][0] - xMean, data[i][1] - yMean];
    }
    return diffData;
}
```

Copy

### Dynamic time warping

The application will start comparing if both rectangles have signatures. That can be done with the following lines of code. The distance function that is injected into the `DynamicTimeWarping` calculates just the euclidian distance between two points in a two-dimensional space.

```
var dtw = new DynamicTimeWarping(sig1, sig2, function (a, b) {
    var xDiff = a[0] - b[0];
    var yDiff = a[1] - b[1];
    return diff = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
});
var result = dtw.getDistance();
```

Copy

The result itself also needs to be normalized. We just divide the result by the length of the dynamic time warping path. Afterwards the result will be compared with an upper bound that was estimated by experience. In my case it was the the average between height and width of the rectangle divided by `15`.

```
var path = dtw.getPath();
var result = result / path.length;
```

Copy

## Example signatures

Here some example signatures and their distances.

Compare *A* and *A*

Distance of 20.774 by a upper bound of 30.

![A signatures](https://gordonlesti.com/media/post/touch-signature-identification-with-javascript/sig1.png)

Compare *A* and *B*

Distance of 61.648 by a upper bound of 30.

![A and B signatures](https://gordonlesti.com/media/post/touch-signature-identification-with-javascript/sig2.png)

Compare *B* and *B*

Distance of 21.454 by a upper bound of 30.

![B signatures](https://gordonlesti.com/media/post/touch-signature-identification-with-javascript/sig3.png)

Compare two *houses*

Distance of 19.091 by a upper bound of 30.

![House of the Nikolaus signatures](https://gordonlesti.com/media/post/touch-signature-identification-with-javascript/sig4.png)

Compare two *anticlockwise circles*

Distance of 8.619 by a upper bound of 30.

![Anticlockwise circles signatures](https://gordonlesti.com/media/post/touch-signature-identification-with-javascript/sig5.png)

Compare *anticlockwise* and *clockwise circle*

Distance of 127.367 by a upper bound of 30.

![House of the Nikolaus](https://gordonlesti.com/media/post/touch-signature-identification-with-javascript/sig6.png)

[Next](https://gordonlesti.com/text-differencing-tool/)[Previous](https://gordonlesti.com/ripping-a-dvd-with-handbrake-on-linux/)

#### About

My name is Gordon Lesti. I have a B.Sc. degree in Computer Science.

#### Tags

[Art](https://gordonlesti.com/tag/art/ "Tag Art") [Audio](https://gordonlesti.com/tag/audio/ "Tag Audio") [Bluetooth](https://gordonlesti.com/tag/bluetooth/ "Tag Bluetooth") [Books](https://gordonlesti.com/tag/books/ "Tag Books") [Bootstrap](https://gordonlesti.com/tag/bootstrap/ "Tag Bootstrap") [C](https://gordonlesti.com/tag/c/ "Tag C") [CAD](https://gordonlesti.com/tag/cad/ "Tag CAD") [Chrome](https://gordonlesti.com/tag/chrome/ "Tag Chrome") [Climbing](https://gordonlesti.com/tag/climbing/ "Tag Climbing") [Conference](https://gordonlesti.com/tag/conference/ "Tag Conference") [CSS](https://gordonlesti.com/tag/css/ "Tag CSS") [D3](https://gordonlesti.com/tag/d3/ "Tag D3") [Debian](https://gordonlesti.com/tag/debian/ "Tag Debian") [Docker](https://gordonlesti.com/tag/docker/ "Tag Docker") [Email](https://gordonlesti.com/tag/email/ "Tag Email") [Firefox](https://gordonlesti.com/tag/firefox/ "Tag Firefox") [Food](https://gordonlesti.com/tag/food/ "Tag Food") [Fpc](https://gordonlesti.com/tag/fpc/ "Tag Fpc") [Gitlab](https://gordonlesti.com/tag/gitlab/ "Tag Gitlab") [Grunt](https://gordonlesti.com/tag/grunt/ "Tag Grunt") [Inkscape](https://gordonlesti.com/tag/inkscape/ "Tag Inkscape") [Java](https://gordonlesti.com/tag/java/ "Tag Java") [JavaScript](https://gordonlesti.com/tag/javascript/ "Tag JavaScript") [LaTeX](https://gordonlesti.com/tag/latex/ "Tag LaTeX") [Linux](https://gordonlesti.com/tag/linux/ "Tag Linux") [Magento](https://gordonlesti.com/tag/magento/ "Tag Magento") [Math](https://gordonlesti.com/tag/math/ "Tag Math") [Meetup](https://gordonlesti.com/tag/meetup/ "Tag Meetup") [Mysql](https://gordonlesti.com/tag/mysql/ "Tag Mysql") [ownCloud](https://gordonlesti.com/tag/owncloud/ "Tag ownCloud") [PDF](https://gordonlesti.com/tag/pdf/ "Tag PDF") [PHP](https://gordonlesti.com/tag/php/ "Tag PHP") [Prism](https://gordonlesti.com/tag/prism/ "Tag Prism") [Python](https://gordonlesti.com/tag/python/ "Tag Python") [QUnit](https://gordonlesti.com/tag/qunit/ "Tag QUnit") [Raspberry Pi](https://gordonlesti.com/tag/raspberry-pi/ "Tag Raspberry Pi") [Search](https://gordonlesti.com/tag/search/ "Tag Search") [Shopware](https://gordonlesti.com/tag/shopware/ "Tag Shopware") [SVG](https://gordonlesti.com/tag/svg/ "Tag SVG") [Talk](https://gordonlesti.com/tag/talk/ "Tag Talk") [Testing](https://gordonlesti.com/tag/testing/ "Tag Testing") [Time Series](https://gordonlesti.com/tag/time-series/ "Tag Time Series") [Tool](https://gordonlesti.com/tag/tool/ "Tag Tool") [Ubuntu](https://gordonlesti.com/tag/ubuntu/ "Tag Ubuntu") [Vagrant](https://gordonlesti.com/tag/vagrant/ "Tag Vagrant") [Video](https://gordonlesti.com/tag/video/ "Tag Video") [VirtualBox](https://gordonlesti.com/tag/virtualbox/ "Tag VirtualBox") [Windows](https://gordonlesti.com/tag/windows/ "Tag Windows") [Wordpress](https://gordonlesti.com/tag/wordpress/ "Tag Wordpress")

#### Archives

[Jun21](https://gordonlesti.com/2021/06/ "Archive June 2021") [Mar21](https://gordonlesti.com/2021/03/ "Archive March 2021") [Dec20](https://gordonlesti.com/2020/12/ "Archive December 2020") [Nov20](https://gordonlesti.com/2020/11/ "Archive November 2020") [Apr20](https://gordonlesti.com/2020/04/ "Archive April 2020") [Oct19](https://gordonlesti.com/2019/10/ "Archive October 2019") [Jun18](https://gordonlesti.com/2018/06/ "Archive June 2018") [Apr18](https://gordonlesti.com/2018/04/ "Archive April 2018") [Mar18](https://gordonlesti.com/2018/03/ "Archive March 2018") [Feb18](https://gordonlesti.com/2018/02/ "Archive February 2018") [Jan18](https://gordonlesti.com/2018/01/ "Archive January 2018") [Dec17](https://gordonlesti.com/2017/12/ "Archive December 2017") [Oct17](https://gordonlesti.com/2017/10/ "Archive October 2017") [Aug17](https://gordonlesti.com/2017/08/ "Archive August 2017") [Jul17](https://gordonlesti.com/2017/07/ "Archive July 2017") [May17](https://gordonlesti.com/2017/05/ "Archive May 2017") [Apr17](https://gordonlesti.com/2017/04/ "Archive April 2017") [Mar17](https://gordonlesti.com/2017/03/ "Archive March 2017") [Feb17](https://gordonlesti.com/2017/02/ "Archive February 2017") [Jan17](https://gordonlesti.com/2017/01/ "Archive January 2017") [Dec16](https://gordonlesti.com/2016/12/ "Archive December 2016") [Nov16](https://gordonlesti.com/2016/11/ "Archive November 2016") [Oct16](https://gordonlesti.com/2016/10/ "Archive October 2016") [Sep16](https://gordonlesti.com/2016/09/ "Archive September 2016") [Aug16](https://gordonlesti.com/2016/08/ "Archive August 2016") [Jul16](https://gordonlesti.com/2016/07/ "Archive July 2016") [Jun16](https://gordonlesti.com/2016/06/ "Archive June 2016") [May16](https://gordonlesti.com/2016/05/ "Archive May 2016") [Mar16](https://gordonlesti.com/2016/03/ "Archive March 2016") [Feb16](https://gordonlesti.com/2016/02/ "Archive February 2016") [Jan16](https://gordonlesti.com/2016/01/ "Archive January 2016") [May15](https://gordonlesti.com/2015/05/ "Archive May 2015") [Apr15](https://gordonlesti.com/2015/04/ "Archive April 2015") [Mar15](https://gordonlesti.com/2015/03/ "Archive March 2015") [Feb15](https://gordonlesti.com/2015/02/ "Archive February 2015") [Jan15](https://gordonlesti.com/2015/01/ "Archive January 2015") [Dec14](https://gordonlesti.com/2014/12/ "Archive December 2014") [Nov14](https://gordonlesti.com/2014/11/ "Archive November 2014") [Sep14](https://gordonlesti.com/2014/09/ "Archive September 2014") [May14](https://gordonlesti.com/2014/05/ "Archive May 2014") [Apr14](https://gordonlesti.com/2014/04/ "Archive April 2014") [Feb14](https://gordonlesti.com/2014/02/ "Archive February 2014") [Jan14](https://gordonlesti.com/2014/01/ "Archive January 2014") [Sep13](https://gordonlesti.com/2013/09/ "Archive September 2013") [Aug13](https://gordonlesti.com/2013/08/ "Archive August 2013") [Jul13](https://gordonlesti.com/2013/07/ "Archive July 2013") [May13](https://gordonlesti.com/2013/05/ "Archive May 2013") [Apr13](https://gordonlesti.com/2013/04/ "Archive April 2013")

#### Links

1.  [RSS 2.0](https://gordonlesti.com/feed/ "RSS 2.0 Feed")
2.  [Github](https://github.com/GordonLesti "Github")
3.  [Twitter](https://twitter.com/GordonLesti "Twitter")

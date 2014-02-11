/**
 * Provides a fancy animation to the download icon.
 *
 * Copyright (C) 2014 Peter Wu <lekensteyn@gmail.com>
 */

'use strict';
/* jshint browser:true, devel:true */
/* globals chrome */
var progress = (function () {
    // number of slices in a round
    var ROTATIONS = 8;

    // tabId => { counter: counter, timer: timerId ]
    var animations = {};
    var img = new Image();
    // assume that the image is loaded before being used for the canvas
    img.src = 'icon_16.png';

    function restoreIcon(tabId) {
        if (tabId in animations) {
            clearInterval(animations[tabId].timer);
            delete animations[tabId];
        }
        // FIXME: image currently shrinks from 19x19 to 16x16
        chrome.pageAction.setIcon({
            path: img.src,
            tabId: tabId
        });
    }

    function getImage(counter) {
        var canvas = document.createElement('canvas');
        canvas.width = canvas.height = 19;
        var ctx = canvas.getContext('2d');
        var s = 19 / img.height;
        ctx.scale(s, s);

        // rotate around center point.
        var h = img.height / 2;
        ctx.translate(h, h);
        ctx.rotate(2 * Math.PI / ROTATIONS * (counter % ROTATIONS));
        ctx.translate(-h, -h);

        // draw original icon
        ctx.drawImage(img, 0, 0);

        return ctx.getImageData(0, 0, 19, 19);
    }

    function drawIcon(tabId) {
        var anim = animations[tabId];

        chrome.pageAction.setIcon({
            imageData: getImage(++anim.counter),
            tabId: tabId
        }, function () {
            if (chrome.runtime.lastError) {
                console.warn("drawIcon:", chrome.runtime.lastError);
            }
        });

        // in case the network has issues?
        if (anim.counter >= ROTATIONS * 16) {
            console.log('Warning: animation took too long, cancelling.');
            restoreIcon(tabId);
        }
    }

    function setAnimatedIcon(tabId) {
        if (tabId in animations) {
            clearInterval(animations[tabId].timer);
        }
        var anim = animations[tabId] = {};
        anim.counter = 0;
        anim.timer = setInterval(drawIcon, 250, tabId);
        drawIcon(tabId);
    }

    function setFinished(tabId, color) {
        restoreIcon(tabId);
        // TODO: distinguish between success or failure?
    }

    return {
        downloadStarting: function (tabId) {
            console.log('Download starting...');
            setAnimatedIcon(tabId);
        },
        downloadFailed: function (tabId) {
            console.log('Download failed.');
            setFinished(tabId, 'red');
        },
        downloadStarted: function (tabId) {
            console.log('Download started.');
            setFinished(tabId, 'green');
        }
    };
})();

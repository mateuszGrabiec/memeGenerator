function init(imgHeight, imgWidth, numOfTextbox, url) {

    var width = imgWidth;
    var height =imgHeight;

    var stage = new Konva.Stage({
        container: 'container',
        width: width,
        height: height
    });

    var layer = new Konva.Layer();
    stage.add(layer);

    for (var i = 0; i < numOfTextbox; i++) {
        var textNode = new Konva.Text({
            text: 'Some text here',
            x: 50,
            y: 80,
            align: 'center',
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1.5,
            fontStyle: 'bold',
            fontSize: 20,
            draggable: true,
            name: 'text-area'
        });


        layer.add(textNode);
        layer.draw();
    }

    var shapes = stage.find('.text-area');
    shapes.forEach(shape => {

        var tr = new Konva.Transformer({
            node: shape,
            name: 'tr',
            enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right','bottom-center','middle-left','middle-right'],
            //set minimum width of text
            boundBoxFunc: function (oldBox, newBox) {
                newBox.width = Math.max(5, newBox.width);
                newBox.height=Math.max(5, newBox.height);
                shape.font=newBox.height;
                return newBox;
            }
        });

        layer.add(tr);


        shape.on('dblclick', () => {
            dbClicked()
        });

        function dbClicked() {


            // hide text node and transformer:
            shape.hide();
            tr.hide();
            layer.draw();

            // create textarea over canvas with absolute position
            // first we need to find position for textarea
            // how to find it?

            // at first lets find position of text node relative to the stage:
            var textPosition = shape.absolutePosition();

            // then lets find position of stage container on the page:
            var stageBox = stage.container().getBoundingClientRect();

            // so position of textarea will be the sum of positions above:
            var areaPosition = {
                x: stageBox.left + textPosition.x,
                y: stageBox.top + textPosition.y
            };

            // create textarea and style it
            var textarea = document.createElement('textarea');
            document.body.appendChild(textarea);

            // apply many styles to match text on canvas as close as possible
            // remember that text rendering on canvas and on the textarea can be different
            // and sometimes it is hard to make it 100% the same. But we will try...
            textarea.value = shape.text();
            textarea.style.position = 'absolute';
            textarea.style.top = areaPosition.y + 'px';
            textarea.style.left = areaPosition.x + 'px';
            textarea.style.width = shape.width() - shape.padding() * 2 + 'px';
            textarea.style.height =
                shape.height() - shape.padding() * 2 + 5 + 'px';
            textarea.style.fontSize = shape.fontSize() + 'px';
            textarea.style.border = 'none';
            textarea.style.padding = '0px';
            textarea.style.margin = '0px';
            textarea.style.overflow = 'hidden';
            textarea.style.background = 'none';
            textarea.style.outline = 'none';
            textarea.style.resize = 'none';
            textarea.style.lineHeight = shape.lineHeight();
            textarea.style.fontFamily = shape.fontFamily();
            textarea.style.transformOrigin = 'left top';
            textarea.style.textAlign = shape.align();
            textarea.style.color = shape.fill();
            textarea.stroke='black';
            rotation = shape.rotation();
            var transform = '';
            if (rotation) {
                transform += 'rotateZ(' + rotation + 'deg)';
            }

            var px = 0;
            // also we need to slightly move textarea on firefox
            // because it jumps a bit
            var isFirefox =
                navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
            if (isFirefox) {
                px += 2 + Math.round(shape.fontSize() / 20);
            }
            transform += 'translateY(-' + px + 'px)';

            textarea.style.transform = transform;

            // reset height
            textarea.style.height = 'auto';
            // after browsers resized it we can set actual value
            textarea.style.height = textarea.scrollHeight + 3 + 'px';

            textarea.focus();

            function removeTextarea() {
                textarea.parentNode.removeChild(textarea);
                window.removeEventListener('click', handleOutsideClick);
                shape.show();
                tr.show();
                tr.forceUpdate();
                layer.draw();
            }

            function setTextareaWidth(newWidth) {
                if (!newWidth) {
                    // set width for placeholder
                    newWidth = shape.placeholder.length * shape.fontSize();
                }
                // some extra fixes on different browsers
                var isSafari = /^((?!chrome|android).)*safari/i.test(
                    navigator.userAgent
                );
                var isFirefox =
                    navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
                if (isSafari || isFirefox) {
                    newWidth = Math.ceil(newWidth);
                }

                var isEdge =
                    document.documentMode || /Edge/.test(navigator.userAgent);
                if (isEdge) {
                    newWidth += 1;
                }
                textarea.style.width = newWidth + 'px';
            }

            textarea.addEventListener('keydown', function (e) {
                // hide on enter
                // but don't hide on shift + enter
                if (e.keyCode === 13 && !e.shiftKey) {
                    shape.text(textarea.value);
                    removeTextarea();
                }
                // on esc do not set value back to node
                if (e.keyCode === 27) {
                    removeTextarea();
                }
                if (e.keyCode === 13) {
                    //confirm changes
                    tr.hide();
                    layer.draw();
                }
            });

            textarea.addEventListener('keydown', function (e) {
                scale = shape.getAbsoluteScale().x;
                setTextareaWidth(shape.width() * scale);
                textarea.style.height = 'auto';
                textarea.style.height =
                    textarea.scrollHeight + shape.fontSize() + 'px';
            });

            function handleOutsideClick(e) {
                if (e.target !== textarea) {
                    shape.text(textarea.value);
                    removeTextarea();
                }
            }

            setTimeout(() => {
                window.addEventListener('click', handleOutsideClick);
                window.addEventListener('touched', handleOutsideClick);
            });
        }

        var timeout;
        var lastTap = 0;
        shape.on('touchend', () => {
            var currentTime = new Date().getTime();
            var tapLength = currentTime - lastTap;
            clearTimeout(timeout);
            if (tapLength < 500 && tapLength > 0) {
                dbClicked();
                event.preventDefault();
            } else {
                timeout = setTimeout(function () {
                    clearTimeout(timeout);
                }, 500);
            }
            lastTap = currentTime;
        });

    });

    Konva.Image.fromURL(url, function (tempNode) {
        tempNode.setAttrs({
            x: 0,
            y: 0,
            scaleX: 0.7,
            scaleY: 0.7
        });
        if (imgHeight > height) {
            tempNode.setAttrs({
                scaleX: 0.5,
                scaleY: 0.5
            })
        }
        layer.add(tempNode);
        tempNode.setZIndex(0);
        layer.batchDraw();
    });

    //clear frames

    function clearFrames() {
        var tr = stage.find('.tr');
        tr.forEach(border => {
            border.hide();
        });
    }

    //save img

    function download() {
        var name = Date.now().toString() + ".png";
        if (imgHeight > height) {
            stage.setWidth(imgWidth * 0.5);
            stage.setHeight(imgHeight * 0.5);
        } else {
            stage.setWidth(imgWidth * 0.7);
            stage.setHeight(imgHeight * 0.7);
        }

        var link = document.createElement('a');

        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream && userAgent.indexOf("Safari") !== -1) {
            alert("iOS + Safari");
            clearFrames();
            var url = stage.toDataURL({format: 'png', multiplier: 4});
            link.href = url.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
            link.download = name;
            link.click();
        } else {
            clearFrames();
            link.href = stage.toDataURL({format: 'png', multiplier: 4});
            link.download = name;
            link.click();
            delete link;
        }
    }

    document.getElementById('save').addEventListener("click", download);
    document.getElementById('save').addEventListener("touchend", download);

}
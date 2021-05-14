
// 自执行函数引入相关文件
(function () {
    let script_list = document.getElementsByTagName('script');
    let src = script_list[script_list.length - 1].src;
    let path = src.slice(0, src.indexOf('js'));
    let head = document.getElementsByTagName('head')[0];

    // // 加载less文件
    // let cssTag = document.createElement('link');
    // cssTag.setAttribute('rel', 'stylesheet/less');
    // cssTag.setAttribute('type', 'text/css');
    // cssTag.setAttribute('href', path + 'css/style.less');
    // head.appendChild(cssTag);
    // // 加载less脚本
    // let lessJs = document.createElement('script');
    // lessJs.setAttribute('src', path + 'js/less.min.js');
    // head.appendChild(lessJs);

    let cssTag = document.createElement('link');
    cssTag.setAttribute('rel','stylesheet');
    cssTag.setAttribute('href',path + 'css/style.css');
    head.appendChild(cssTag)
}());

(function () {
    // 命名空间避免命名冲突
    let namespace = "__techModal";

    // 模态框索引
    let dialog_index = 0;

    // 索引数组
    let dialog_list = [];
    let dialog_list_rear = -1;

    /**
     * 弹出对话框
     * @param option 参数可选项：<br/>
     * url：页面框URL > content：信息框内容<br/>
     * anim：弹窗动画：1-18,其他数值无动画,默认为1<br/>
     * title：标题<br/>
     * titleBgColor：标题背景颜色<br/>
     * titleColor：标题字体颜色<br/>
     * area、width、height：自定义宽高，宽默认50%，高默认auto<br/>
     * center、centerX、centerY：对话框中心位置<br/>
     * params：页面传递参数<br/>
     * scrollable：若为页面框是否可滚动<br/>
     * movable：是否可移动，默认为true<br/>
     * opacity：不透明度，默认为1不透明<br/>
     * maxOpacity：最大化不透明度，默认等于opacity<br/>
     * bgColor：背景颜色<br/>
     * toolbar：右上按钮，true、false、颜色<br/>
     * borderColor：边框颜色<br/>
     * shadowColor：阴影颜色<br/>
     * color：字体颜色<br/>
     * corner：边角，true、false、颜色<br/>
     * overlay：遮罩层，true、false、颜色<br/>
     * btn、ok、cancel：底部按钮<br/>
     * btnBorderColor、okBorderColor、cancelBorderColor：底部按钮边框颜色<br/>
     * btnBgColor、okBgColor、cancelBgColor：底部按钮背景颜色<br/>
     * btnColor、okColor、cancelColor：底部按钮字体颜色<br/>
     * beforeShow：弹出之前的回调函数<br/>
     * afterShow：弹出之后的回调函数<br/>
     * yes：确定按钮的回调函数<br/>
     * no：取消按钮的回调函数<br/>
     * maximize：最大化回调函数<br/>
     * restore：恢复窗口回调函数
     */
    window.Dialog = function (option) {

        let thisIndex = ++dialog_index;
        // 保存索引
        ++dialog_list_rear;
        dialog_list[dialog_list_rear] = thisIndex;
        this.index = thisIndex;

        // 原始尺寸、位置
        let preWidth;
        let preHeight;
        let preLeft;
        let preTop;

        // 信息框内容；
        let content = option['content'];
        if (content == null) {
            content = '';
        }
        // 页面框URL
        let url = option['url'];

        // 标题
        let title = option['title'];

        // 标题背景色
        let titleBgColor = option['titleBgColor'];
        if (titleBgColor == null) {
            titleBgColor = 'rgba(0,255,255,0.2)';
        }

        // 标题字体颜色
        let titleColor = option['titleColor'];
        if (titleColor == null) {
            titleColor = '#fff';
        }

        // 弹窗动画
        let anim = option['anim'];
        if (anim == null) {
            anim = 1;
        }

        //自定义宽高
        let area = option['area'];
        let width = option['width'];
        let height = option['height'];
        if (area != null) {
            width = area[0];
            height = area[1];
        }
        // 对话框中心位置
        let center = option['center'];
        let centerX = option['centerX'];
        let centerY = option['centerY'];
        if (center != null) {
            width = area[0];
            height = area[1];
        }

        // 页面传递参数
        let params = option['params'];
        let p = '?';
        for (let key in params) {
            if (params.hasOwnProperty(key)) {
                p += (key + '=' + params[key] + '&');
            }
        }

        // 是否可滚动
        let scrollable = option['scrollable'];
        if (scrollable == null) {
            scrollable = false;
        }

        // 是否可移动
        let movable = option['movable'];
        if (movable == null) {
            movable = true;
        }

        // 不透明度，若背景颜色通过颜色名称指定则失效
        let opacity = option['opacity'];
        if (opacity == null) {
            opacity = 1;
        }

        //最大化的不透明度
        let maxOpacity = option['maxOpacity'];
        if (maxOpacity == null) {
            maxOpacity = opacity;
        }

        // 背景颜色
        let bgColor = option['bgColor'];
        if (bgColor == null) {
            bgColor = 'rgb(0,20,60)';
        }
        // 右上按钮
        let toolbar = option['toolbar'];
        if (toolbar == null) {
            toolbar = true;
        }
        // 边框颜色
        let borderColor = option['borderColor'];
        if (borderColor == null) {
            borderColor = 'rgba(25, 186, 139, .17)';
        }

        // 阴影颜色
        let shadowColor = option['shadowColor'];
        if (shadowColor == null) {
            shadowColor = 'cyan';
        }

        // 字体颜色
        let color = option['color'];
        if (color == null) {
            color = '#fff';
        }

        // 边角，true、false、颜色
        let corner = option['corner'];
        if (corner == null) {
            corner = true;
        }

        // 遮罩层
        let overlay = option['overlay'];
        if (overlay == null) {
            overlay = true;
        }

        // 底部按钮
        let btn = option['btn'];
        let ok = option['ok'];
        let cancel = option['cancel'];
        if (btn == null || !(btn instanceof Array)) {
            btn = false;
        }
        if (btn === true) {
            if (ok == null && cancel == null) {
                ok = '确定';
                cancel = '取消';
            }
        } else if (btn !== false) {
            ok = btn[0];
            cancel = btn[1];
        }

        // 底部按钮的边框颜色
        let btnBorderColor = option['btnBorderColor'];
        let okBorderColor = option['okBorderColor'];
        let cancelBorderColor = option['cancelBorderColor'];
        if (btnBorderColor != null && btnBorderColor instanceof Array) {
            okBorderColor = btnBorderColor[0];
            cancelBorderColor = btnBorderColor[1];
        }

        // 底部按钮的背景颜色
        let btnBgColor = option['btnBgColor'];
        let okBgColor = option['okBgColor'];
        let cancelBgColor = option['cancelBgColor'];
        if (btnBgColor != null && btnBgColor instanceof Array) {
            okBgColor = btnBgColor[0];
            cancelBgColor = btnBgColor[1];
        }

        // 底部按钮的字体颜色
        let btnColor = option['btnColor'];
        let okColor = option['okColor'];
        let cancelColor = option['cancelColor'];
        if (btnColor != null && btnColor instanceof Array) {
            okColor = btnColor[0];
            cancelColor = btnColor[1];
        }

        // 回调函数
        let beforeShow = option['beforeShow'];
        let afterShow = option['afterShow'];
        let yes = option['yes'];
        let no = option['no'];
        let maximize = option['maximize'];
        let restore = option['restore'];

        let node = '<div class="' + namespace + '-md-modal ' + namespace + '-md-effect-' + anim + '" ' +
            'id="' + namespace + '-modal-' + thisIndex +
            '" style="width: ' + (width != null ? width : '50%') + ';height: ' + (height != null ? height : 'auto') +
            (centerX != null ? ';left: ' + centerX : '') + (centerY != null ? (';top: ' + centerY) : '') + '">' +

            '<div class="' + namespace + '-md-content" style="background-color: ' + parseColorToRgba(bgColor, opacity) +
            ';box-shadow: 0 0 5px ' + parseColorToRgba(shadowColor) +
            ';border-color: ' + parseColorToRgba(borderColor) + ';color: ' + parseColorToRgba(color) + '">' +

            (title != null ? '<div class="' + namespace + '-md-title" style="background: ' + parseColorToRgba(titleBgColor) +
                ';color: ' + parseColorToRgba(titleColor) + '">' + title + '</div>' : '') +

            (toolbar !== false ? '<div class="' + namespace + '-md-button-tools" style="color: ' + parseColorToRgba(toolbar) + '">' +
                (movable ? '<i class="' + namespace + '-md-move iconfont icon-move"></i>' : '') +
                '<i class="' + namespace + '-md-max-restore iconfont icon-fullscreen-expand"></i>' +
                '<i class="' + namespace + '-md-close iconfont icon-close"></i></div>' : '') +

            '<div class="' + namespace + '-content">' + (url != null ? ('<iframe id="' + namespace + '-iframe-' + thisIndex + '" ' +
                'style="visibility: hidden;border: 0;width: 100%;height: 100%" ' +
                'scrolling="' + (scrollable ? 'auto' : 'no') + '" src="' + url + p + '"></iframe>') : content) + '</div>' +

            (btn !== false ? '<div class="' + namespace + '-md-button">' +
                (ok != null ? '<button class="' + namespace + '-btn-ok" style="color: ' + parseColorToRgba(okColor) +
                    ';background: ' + parseColorToRgba(okBgColor) + ';border-color: ' + parseColorToRgba(okBorderColor) +
                    '">' + ok + '</button>' : '') +
                (cancel != null ? '<button class="' + namespace + '-btn-cancel" style="color: ' + parseColorToRgba(cancelColor) +
                    ';background: ' + parseColorToRgba(cancelBgColor) + ';border-color: ' + parseColorToRgba(cancelBorderColor) +
                    '">' + cancel + '</button>' : '') + '</div>' : '') +

            (corner !== false ? ('<div class="' + namespace + '-corner-left-top" style="border-color: ' + parseColorToRgba(corner) + '"></div>' +
                '<div class="' + namespace + '-corner-right-top" style="border-color: ' + parseColorToRgba(corner) + '"></div>' +
                '<div class="' + namespace + '-corner-left-bottom" style="border-color: ' + parseColorToRgba(corner) + '"></div>' +
                '<div class="' + namespace + '-corner-right-bottom" style="border-color: ' + parseColorToRgba(corner) + '"></div>') : '') +

            '</div></div>' + (overlay !== false ? '<div class="' + namespace + '-md-overlay" id="' + namespace + '-overlay-' + thisIndex +
                '" style="background: ' + parseColorToRgba(overlay) + '"></div>' : '');

        document.querySelector('body').insertAdjacentHTML("beforeend", node);

        let modal = document.querySelector('#' + namespace + '-modal-' + thisIndex),
            max_restore = modal.querySelector('.' + namespace + '-md-max-restore'),
            close = modal.querySelector('.' + namespace + '-md-close');

        // 通过读取一个属性 让页面重新渲染 否则不会触发 css3 的特效
        window.getComputedStyle(modal).width;

        // 设置模态框的层叠值
        modal.style.zIndex = String(1000 + thisIndex * 2);

        if (overlay !== false) {
            let overlay_dom = document.querySelector('#' + namespace + '-overlay-' + thisIndex);
            // 设置遮罩层的层叠值
            overlay_dom.style.zIndex = String(1000 + thisIndex * 2 - 1);
            overlay_dom.removeEventListener('click', function () {
                closeDialog(thisIndex);
            });
            overlay_dom.addEventListener('click', function () {
                closeDialog(thisIndex);
            });
        }

        if(url != null) {
            let iframe = document.getElementById(namespace + '-iframe-' + thisIndex);
            iframe.onload = function () {
                iframe.style.visibility = "";
            };
        }

        // 拖动
        if (toolbar && movable) {
            modal.querySelector('.' + namespace + '-md-move').addEventListener("mousedown", move);
        }

        if (toolbar) {
            max_restore.addEventListener('click', max);
        }

        if (toolbar) {
            close.addEventListener('click', function (ev) {
                ev.stopPropagation();
                closeDialog(thisIndex);
            });
        }

        if (ok != null) {
            if (typeof yes === 'function') {
                modal.querySelector('.' + namespace + '-btn-ok').addEventListener('click', function () {
                    yes(thisIndex);
                });
            } else {
                modal.querySelector('.' + namespace + '-btn-ok').addEventListener('click', function () {
                    closeDialog(thisIndex);
                });
            }
        }
        if (cancel != null) {
            if (typeof no === 'function') {
                modal.querySelector('.' + namespace + '-btn-cancel').addEventListener('click', function () {
                    no(thisIndex);
                });
            } else {
                modal.querySelector('.' + namespace + '-btn-cancel').addEventListener('click', function () {
                    closeDialog(thisIndex);
                });
            }
        }

        if (typeof beforeShow === 'function') {
            beforeShow(thisIndex);
        }

        modal.classList.add(namespace + '-md-show');

        if (typeof afterShow === 'function') {
            afterShow(thisIndex);
        }

        // 最大化
        function max(evt) {
            evt.stopPropagation();
            let content = modal.querySelector('.' + namespace + '-md-content');

            // 记录最大化前的尺寸、位置
            preWidth = modal.offsetWidth;
            preHeight = modal.offsetHeight;
            preLeft = modal.style.left;
            preTop = modal.style.top;

            expand();

            content.style.backgroundColor = parseColorToRgba(bgColor, maxOpacity);

            if (movable) {
                // 不可拖动
                let moveBtn = content.querySelector('.' + namespace + '-md-move');
                moveBtn.removeEventListener("mousedown", move);
                moveBtn.parentNode.removeChild(moveBtn);
            }

            this.blur();
            this.classList.remove('icon-fullscreen-expand');
            this.classList.add('icon-fullscreen-shrink');
            let max_restore = modal.querySelector('.' + namespace + '-md-max-restore');
            max_restore.removeEventListener('click', max);
            max_restore.addEventListener('click', ret);

            window.addEventListener('resize', expand);
            modal.style.transition = 'all .2s';
            setTimeout(function () {
                modal.style.transition = 'opacity 0.2s';
            }, 200);
        }

        // 还原
        function ret(evt) {
            evt.stopPropagation();
            let content = modal.querySelector('.' + namespace + '-md-content');

            shrink();

            content.style.backgroundColor = parseColorToRgba(bgColor, opacity);

            if (movable) {
                // 恢复可拖动状态
                modal.querySelector('.' + namespace + '-md-button-tools')
                    .insertAdjacentHTML('afterbegin', '<i class="' + namespace + '-md-move iconfont icon-move"></i>');
                modal.querySelector('.' + namespace + '-md-move').addEventListener('mousedown', move);
            }

            this.blur();
            this.classList.remove('icon-fullscreen-shrink');
            this.classList.add('icon-fullscreen-expand');
            let max_restore = modal.querySelector('.' + namespace + '-md-max-restore');
            max_restore.removeEventListener('click', ret);
            max_restore.addEventListener('click', max);

            window.removeEventListener('resize', expand);
            modal.style.transition = 'all .2s';
            setTimeout(function () {
                modal.style.transition = 'opacity 0.2s';
            }, 200);
        }

        // 拖动
        function move(evt) {
            evt.stopPropagation();
            // 判断鼠标左键
            if (evt.button === 0) {
                let modal = this.closest('.' + namespace + '-md-modal');
                let content = modal.querySelector('.' + namespace + '-content');
                let oEvent = evt || event;
                let distanceX = oEvent.clientX - modal.offsetLeft;
                let distanceY = oEvent.clientY - modal.offsetTop;
                // 鼠标移动
                document.addEventListener("mousemove", mousemove);

                function mousemove(evt) {
                    // 阻止iframe获取mousemove事件
                    content.style.pointerEvents = 'none';
                    // 整个页面不可选中
                    document.body.style.userSelect = 'none';
                    // 不透明度
                    modal.style.opacity = String(0.5);
                    let oEvent = evt || event;
                    modal.style.left = oEvent.clientX - distanceX + 'px';
                    modal.style.top = oEvent.clientY - distanceY + 'px';
                }

                // 鼠标按键抬起
                document.addEventListener("mouseup", mouseup);

                function mouseup(evt) {
                    if (evt.button === 0) {
                        // 恢复iframe获取mousemove事件
                        content.style.pointerEvents = 'auto';
                        // 整个页面不可选中
                        document.body.style.userSelect = 'auto';
                        // 不透明度
                        modal.style.opacity = String(1);
                        document.removeEventListener("mousemove", mousemove);
                        document.removeEventListener("mouseup", mouseup);
                    }
                }
            }
        }

        // 放大
        function expand() {
            modal.style.left = '50%';
            modal.style.top = '50%';
            modal.style.width = window.innerWidth - 6 + "px";
            modal.style.height = window.innerHeight - 6 + "px";
            if (typeof maximize === 'function') {
                maximize(thisIndex);
            }
        }

        // 缩小
        function shrink() {
            modal.style.left = preLeft;
            modal.style.top = preTop;
            modal.style.width = preWidth + 'px';
            modal.style.height = preHeight + 'px';
            if (typeof restore === 'function') {
                restore(thisIndex);
            }
        }

        function parseColorToRgba(color, opacity = 1) {
            if (!(0 <= opacity && opacity <= 1)) {
                opacity = 1;
            }
            let rgba = [];
            if (color != null) {
                // 转为字符串
                color = '' + color;
                // 去空格
                color = color.replace(/\s*/g, '');
                // 转小写
                color = color.toLowerCase();
                // 正则
                let reg1 = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
                let reg2 = /^rgb\([0-9]+,[0-9]+,[0-9]+\)$/;
                let reg3 = /^rgba\([0-9]+,[0-9]+,[0-9]+,(0|1|\.[0-9]+|0\.[0-9]+|1\.0+)\)$/;
                if (reg1.test(color)) {
                    if (color.length === 4) {
                        for (let i = 0; i < 3; ++i) {
                            rgba.push(parseInt(color[i + 1].concat(color[i + 1]), 16));
                        }
                    } else if (color.length === 7) {
                        for (let i = 0; i < 3; ++i) {
                            rgba.push(parseInt(color.slice(i * 2 + 1, i * 2 + 3), 16));
                        }
                    }
                    rgba.push(opacity);
                } else if (reg2.test(color)) {
                    rgba = color.split('(')[1].split(')')[0].split(',');
                    rgba.push('' + opacity);
                } else if (reg3.test(color)) {
                    rgba = color.split('(')[1].split(')')[0].split(',');
                    rgba[3] = parseFloat(rgba[3]) * opacity;
                } else {
                    return color;
                }
            } else {
                return color;
            }
            return 'rgba(' + rgba.toString() + ')';
        }
    };
    // 关闭对话框
    window.closeDialog = function (index) {
        if (index == null && dialog_list_rear > -1) {
            index = dialog_list[dialog_list_rear];
        }
        if (index != null) {
            let modal = document.querySelector('#' + namespace + '-modal-' + index);
            if (modal != null) {
                modal.classList.remove(namespace + '-md-show');
                let dIndex = dialog_list.indexOf(index);
                if (dIndex > -1) {
                    dialog_list.splice(dIndex, 1);
                    --dialog_list_rear;
                }
                setTimeout(function () {
                    let overlay_dom = document.querySelector('#' + namespace + '-overlay-' + index);
                    if (overlay_dom != null) {
                        overlay_dom.parentNode.removeChild(overlay_dom);
                    }
                    let modalParent = modal.parentNode;
                    if (modalParent != null) {
                        modalParent.removeChild(modal);
                    }
                }, 300);
            }
        }
    }
}());

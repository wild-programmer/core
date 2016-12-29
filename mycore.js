/**
 * Created by wlt05 on 2016/12/18.
 */


(function (window) {
//在这里借用数组的方法用call,apply改变push的指向给jQuery添加值 所以这个伪数组的length就会随着改变了
    var arr = [];
    var push = arr.push;
    var toSting = ({}).toString;
    var slice = arr.slice;
    //判断参数是不是一个html字符串
    function isHTML(html) {
        if (!!html && html[0] === '<' && html[html.length - 1] === ">" && html.length > 3) {
            return true;
        }
        return false;
    };

    //        根据传入的html字符串，创建解析出对应的元素
    function parseHTML(html) {
        var div = document.createElement("div");
        div.innerHTML = html;
        return div.children;
    }

    //判断参数是不是一个函数
    function isFunction(Func) {
        return typeof Func === 'function';
    }

    //  判断参数是不是数字
    function isNumber(num) {
        return typeof num === 'number';
    }

    // 判断参数是不是一个字符串
    function isString(string) {
        return typeof string === "string";
    }

    //  判断参数是不是window 判断参数（如果没传参就是undifind，调用undifind会报错，所以要先判断参数不能为空）

//      传入函数，该函数在DOM树构建完毕的时候被执行
    function ready(fn) {
        /*
         * 实现思路：
         * 1、判断DOM树是否已经构建完毕，如果是，执行执行fn即可
         * 2、如果不是，监听DOM树构建完毕的事件，事件触发时执行fn。
         * */

        // 无论IE8还是现代浏览器，readyState值为'complete'，DOM树一定构建完毕了；
        // 如果是现代浏览器，readyState值为'interactive'，DOM树也构建完毕。
        if (document.readyState == 'complete' || (document.addEventListener && document.readyState == 'interactive')) {
            fn();
        } else {
            if (document.addEventListener) {
                document.addEventListener('DOMContentLoaded', fn);
            } else {
                document.attachEvent('onreadystatechange', function () {
                    if (document.readyState === 'complete') {
                        fn();
                    }
                });
            }
        }
    }

    //        判断参数是不是window 判断参数（如果没传参就是undifind，调用undifind会报错，所以要先判断参数不能为空）
    function isWindow(window) {
        return !!window && window.window === window;
    }

//        获取一个对像的具体类型  计算后的样式更精确
    function getObjType(obj) {
        return toString.call(obj).slice(8, -1);
    }

    //        判断参数是不是对象（函数，数组等等都是对象，typeof获取到null的类型也是object，固不能为null）
    function isObj(obj) {
        return typeof obj === 'function' || typeof obj === 'object' && obj !== null;
    }

    //        判断数据是不是数组或者类数组
    function isArrayLike(arr) {
        /*
         * 思路
         * 要是函数或者是window,就直接返回false
         * 判断arr是不是一个对象，是的话就进一步判断
         * 判断arr是不是一个真数组，如果是就直接返回ture
         * 4判断arr是不是一个伪数组，若是就直接返回true
         * 4.1 如果arr的length为0 那么就认为是伪数组 因为证明有了lenght属性 不过为0下面的判断对它也没什么意义，不过具备这个属性就是伪数组
         * 或者lenght的值为数值且大于0,并且最大下标的值存在数组里 那么就认为是伪数组
         * 默认返回false
         * */
        var len = arr.length;
        if (isFunction(arr) || isWindow(arr)) {
            return false;
        }
        if (isObj(arr)) {
            if (getObjType(arr) === 'Array') {
                return true;
            } else if (len === 0 ||( len > 0 && isNumber(len) && (len - 1) in arr)) {
                return true;
            }
        }
        return false;
    }

// 把创建新实例的工作交给pushStack完成，
    // 同时pushStack还可以帮助新实例记录上一级链
    function pushStack(obj) {
        var $obj = jQuery(obj);
        $obj.preObj = this;
        return $obj;
    }

    //是不是DOM元素 nodeType是DOM里的属性 有这个属性就代表他是dom 如不先判断不为空，undefind调用nodetype会报错
    function isDom(Dom) {
        return !!Dom && !!Dom.nodeType;
    }
    // @function 实现each
    // @param { obj: Object } 要遍历的对象
    // @param { fn: Function } 遍历过程中，所需的回调，该回调会接收遍历到的下标和值
    function  each(obj,fn){
        // 如果要遍历的对象，是数组或伪数组，通常我们要得到他们下标存储的数据，
        // 这种情况下，就不能使用for in了。

        /*
         * 实现思路：
         * 1、判断obj是不是数组或者伪数组，如果是则var i的形式遍历它
         * 2、如果是其他对象，则通过for in的形式遍历它
         * 3、把遍历到的下标和值依次传给回调
         * */

        // 如果是数组，var i 方式遍历，
        // 然后把遍历到的下标和值传给回调，
        // 同时改变回调执行时内部this为值 便于以后对？？？？？？？？？？？？？
        if( isArrayLike( obj ) ) {
            for( var i = 0; i < obj.length; i++ ) {
                // 约定，如果回调的执行结果为false，那么就中断遍历
                if( fn.call( obj[ i ], i, obj[ i ] ) === false ) {
                    break;
                }
            }
        }
        // 否则，for in 方式遍历，
        // 然后把遍历到的下标和值传给回调，
        // 同时改变回调执行时内部this为值
        else {
            for (var key in obj) {
                // 约定，如果回调的执行结果为false，那么就中断遍历
                if (fn.call(obj[key], key, obj[key]) === false) {
                    break;
                }
            }
        }
        // 遍历谁就返回谁
        return obj;
    }
    //        通过一组数据得到另一组数据，
    // map会把遍历到的下标和值传入回调，然后接收回调的返回结果并存储起来，
    // 最后把所有结果一起包装成新jQ对象返回。
    function map(obj,fn){
        /*
         * 实现思路：
         * 1、判断是不是真伪数组，如果是var i遍历，不是for in遍历
         * 2、遍历到的下标和值传给回调
         * 3、改变回调执行时的this指向为val
         * 4、然后判断回调执行的结果，如果不为undefind或null，(undefind==null)那么存储起来
         * 5、返回所有存储的数据
         * */
        var result=[],temp;
          if(isArrayLike(obj)){
              for (var i = 0; i < obj.length; i++) {
                   temp = fn.call(obj[i],i,obj[i]);//把传进来的这个回调函数的返回值，push一个数组返回
                if(temp!=null){
                    result.push(temp);
                }
              }
          }else {
              for (var k in obj){
                  temp=fn.call(obj[k],k,obj[k]);
                  if(temp!=null){
                      result.push(temp);
                  }
              }
          }
        return result;
    }
//       添加一个兼容获取样式的静态方法
    function getStyle(ele, styleName){
        // 如果ele不是DOM，styleName不是字符串，那么直接返回，不做任何处理。window的方法getComputedStyle获取详细的dom样式
        if(!isDom(ele)&& !isString(styleName)){
            return;
        }
        if( window.getComputedStyle ) {
            return window.getComputedStyle( ele )[ styleName ];
        }else {
            return ele.currentStyle[ styleName ];
        }
    }
    function css(styleName, styleVal){
        /*
         * 实现思路：
         * 1、如果参数个数为1，需要进一步判断处理
         * 1.1、如果是字符串，直接返回第一个元素指定的样样式
         * 1.2、如果是对象，那么遍历得到每一个元素，再遍历这个对象得到所有要设置的样式，分别设置。
         * 2、如果参数个为2，那么遍历得到每一个元素，分别按照指定的样式名设置指定样式。
         * 3、默认返回this，实现链式编程。
         * */
        var arg = arguments, len = arg.length;
        var i, nodeLen, key;

        // 参数1个
        if( len === 1 ) {

            // 参数为字符串的处理
            if( isString( styleName ) ) {

                // 返回第一个元素指定的样式
                return getStyle( this[0], styleName );
            }
            // 参数为对象的处理,给所有元素批量设置样式
            else if( isObj( styleName ) ) {
                // 遍历得到每一个要添加的样式
                for( key in styleName ) {
                    // 给每一个元素分别设置每一个样式
                    this[ i ].style[ key ] = styleName[ key ];
                }
            }
        }

        // 参数2个，给所有元素添加指定样式
        else if( len > 1 ) {

            // 遍历得到每一个元素
            for( i = 0, nodeLen = this.length; i < nodeLen; i++ ) {
                // 给每一个元素设置指定样式
                this[ i ].style[ styleName ] = styleVal;
            }
        }

        // 链式编程
        return this;
    }
    // 不传参获取第一个元素的value属性值，
    // 传参给所以元素设置指定的value属性值
    function val(val){
        var arg=arguments, len = arg.length;
        // 不传参获取第一个元素的value属性值，
        if(len==0){
            return this[0].value;
        }
        // 参给所有元素设置指定的value属性值
        else {
            this.each(function () {
                this.value=val;
            });
        }
        return this;
    };
    // 设置或者获取属性节点
    function attr(attrName, attrVal){
        var arg = arguments, len=arg.length;
        if(len==1){
                if(isString(attrName)){
                    return this[0].getAttribute(attrName)
                }
                if (isObj(attrName)){
                    this.each(function () {
                        var self = this;
                        // 遍历每一个属性节点名和值
                        each( attrName, function( attrName, attrVal ) {
                            self.setAttribute(attrName, attrVal);
                        });
                    });

                }
        }else  if(len>1){
            this.each(function () {
                this.setAttribute(attrName, attrVal);
            })
        }
        return this;
    }
    // 设置或者获取属性
    function prop(propName, propVal){
        var arg = arguments,len=arg.length;
        if(len==0){
            if(isString(propName)){
                return this[0][propName];
            }
            if(isObj(propName)){
                this.each(function() {
                    var self = this;
                    $.each(propName, function( propName, propVal ) {
                        self[ propName ] = propVal;
                    });
                });
            }
        }else if(len>1){
            this.each(function () {
                this[ propName ] = propVal;
            })
        }
    }
    function html( html ) {
        /*
         * 实现思路：
         * 1、如果不传参，直接返回第一个元素的innerHTML
         * 2、传参进一步区分
         * 2.1、null则清空所有元素的innerHTML
         * 2.2、重置所有元素的innerHTML
         * 3、链式编程返回this
         * */
        if(arguments.length===0){
            return this[0].innerHTML;
        }
        if(arguments.length>0){
            if (html===null){
                this.each(function () {
                    this.innerHTML="";
                })
            }else {
                this.each(function () {
                    this.innerHTML=html;
                })
            }
        };
        return this;
    };
    // 设置或者获取元素的innerText
    function  text( text ) {
        /*
         * 实现思路：
         * 1、如果不传参，返回所有元素的innerText
         * 2、传参进一步区分
         * 2.1、null则清空所有元素的innerText
         * 2.2、重置所有元素的innerText
         * 3、链式编程返回this
         * */
        var arr='',len=arguments.length;
        if (len===0){
            this.each(function () {
                arr+=this.innerText;
            });
            return arr;
        };
        if(arguments.length>0){
            this.each(function () {
                this.innerText=text;
            })
        };
        return this;

    };
    // 删除元素
    function  remove(){
        return this.each(function () {
            this.parentNode.removeChild( this );
        })
    };
    /*
    * appendTo
    * 把自己添加到指定元素的后面
    * /参数可以传选择器、DOM对象、jQ对象
    * */
    function appendTo ( parent ) {
        /*
         * 实现思路：
         * 1、先把parent统一包装成jQ实例
         * 2、遍历所有的父元素
         * 3、遍历所有的子元素
         * 4、如果是第一个父元素添加子元素，那么添加本体，否则添加子元素的clone版本
         * 5、每次添加子元素，都需要把子元素保存下来
         * 6、最后把所有被添加的子元素包装成jQ对象返回，这个对象要记录上级链。
         * */

        // 把参数包装成jQ对象，方便统一处理
        var $parents = jQuery( parent );
        var $sons = this;
        var temp, result = [];
        // 遍历得到所有父元素
        $parents.each(function( i ) {
            var parent = this;
            // 遍历得到所有子元素
            $sons.each(function() {
                // 只有第一次添加子元素本体，以后添加clone版本
                if( i === 0 ) {
                    parent.appendChild( this );
                    result.push(this);
                }else {
                    temp = this.cloneNode( true );
                    parent.appendChild( temp );
                    result.push( temp );
                }
            });
        });

        // 返回所有被添加元素组成的新实例
        return this.pushStack( result );
    };
    function _appendTo ( parent ) {
        var $parents = jQuery( parent );
        var $sons = this;
        var temp, result = [];
        // 遍历得到所有父元素
        $parents.each(function( i ) {
            var parent = this;
            // 遍历得到所有子元素
            $sons.each(function() {
                result.push( parent.appendChild( i === 0? this: this.cloneNode( true ) ) );
            })
        });
        return this.pushStack( result );
    }
    /*
     * prependTo：
     * 把自己添加到指定元素的最前面,
     * 参数可以传选择器、DOM对象、jQ对象，代表父元素,
     * 返回所有被添加的元素组成的新实例。
     * */
    function  prependTo(parent){
        var $that=this;
        var result=[];
        var $sons = this;
        $(parent).each(function (i) {
            var parent=this;
           $sons.each(function () {
               // 第一个父添加子元素本地，以后添加clone版本；
               // 被添加的子元素存储到result中。
               result.push( parent.insertBefore( i === 0? this: this.cloneNode( true ),parent.firstChild ) );
           })
        });
        return this.pushStack(result)
    }
    /*
     * append：
     * 给自己添加子元素，
     * 参数可以传文本、DOM对象、jQ对象，代表子元素,
     * 返回this。
     * */
    function append( son ) {
        /*
         * 实现思路：
         * 1、如果son是字符串，先解析成DOM元素（不能累加到所有元素的innerHTML中）
         * 2、统一包装成jQ实例
         * 3、遍历父元素
         * 4、遍历子元素
         * 5、第一个父添加子元素本体，以后添加clone版本
         * 6、链式编程返回this
         * */

        // 如果是字符串，先解析成DOM元素
        if( $.isString( son ) ) {
            son = $.parseHTML( son )
        }
        var $sons = jQuery( son );
        // 遍历所有的父元素
        this.each(function( i ) {
            var parent = this;

            // 遍历被添加的子元素
            $sons.each( function() {

                // 第一个父添加子元素本体，以后添加clone版本
                parent.appendChild( i === 0? this: this.cloneNode( true ) );
            });
        });

        // 链式编程
        return this;
    };
    // 在自己的前面添加兄弟节点
    function before( sibling ) {

        // 如果sibling为字符串，先要转换为DOM
        if( $.isString( sibling ) ) {
            sibling = $.parseHTML( sibling );
        }

        var $sibling = jQuery( sibling );

        // 复用insertBefore把$sibling添加到this的前面
        $sibling.insertBefore( this );

        // 链式编程返回this
        return this;
    };
    // 把自己添加到某兄弟元素的前面
    function insertBefore( sibling ) {
        /*
         * 实现思路：
         * 1、先把sibling包装成jQ对象统一处理
         * 2、遍历所有的sibling，然后得到他们的每一个父元素
         * 3、遍历所有的子元素
         * 4、父添加子，第一个父添加子元素本体，以后clone
         * 5、收集所有被添加的子元素，然后使用pushStack包装返回
         * */
        var $sibling = jQuery( sibling );
        var $sons = this;
        var result = [];

        // 遍历所有的sibling
        $sibling.each(function( i ) {

            var sibling = this;
            var parent = this.parentNode;

            // 遍历所有被添加的子元素
            $sons.each(function() {

                // 把子元素添加到指定兄弟元素的前面，第一个父添加是子元素本体，以后是clone的，
                // 最后把被添加的元素统一存储到一个容器中
                result.push( parent.insertBefore( i === 0? this: this.cloneNode(true), sibling ) );
            });
        });

        return this.pushStack( result );
    };

// 把自己添加到指定兄弟元素的后面
    function insertAfter( sibling ) {
        /*
         * 实现思路：
         * 1、先把sibling包装成jQ对象统一处理
         * 2、遍历所有的sibling，然后得到他们的每一个父元素
         * 3、遍历所有的子元素
         * 4、父添加子，第一个父添加子元素本体，以后clone
         * 5、收集所有被添加的子元素，然后使用pushStack包装返回
         * */
        var $sibling = jQuery(sibling);

        var $son = this;

        var result = [];

        $sibling.each(function (i, ele) {
            $son.each(function () {
                var addEle = i === 0 ? this : this.cloneNode(true);
                console.log(this);
                result.push(ele.parentNode.insertBefore(addEle, ele.nextSibling));

                ele = addEle;

            })
        })

        return this.pushStack(result);
    };

    //18.(在自己的前面添加兄弟节点)
    function before(sibling){

        if(isString(sibling)){

            sibling = parseHTML(sibling);

        }

        var $sibling = jQuery(sibling);

        $sibling.insertBefore(this);

        return this;

    };



    //20.添加children方法
   function  children(){
        // 返回所有元素的子元素
        var result = [];

        this.each(function(){

            result.push.apply(result,this.children);

        })

        return this.pushStack(result);

    };

    //21.在原型上添加next方法(返回所有元素的下一个兄弟元素)
    function next() {

        var nextNode,result = [];

        this.each(function(){

            nextNode = this;

            while(nextNode = nextNode.nextSibling){

                if(nextNode.nodeType === 1){

                    result.push(nextNode);

                    break;

                }

            }

        })

        return this.pushStack(result);
    };

    //封装事件函数
    function addEvent(ele, type, fn) {

        //ele不是DOM，type不是字符串，fn不是函数，无法绑定事件，直接打发走
        if (!isDom(ele) || !isString(type) || !isFunction(fn)) {
            return;
        }

        if (document.addEventListener) {

            ele.addEventListener(type, fn);

        } else {

            ele.attachEvent('on' + type, fn);

        }
    }
    //22.在原型上添加on方法
    /*
     * on方法调用时，有一个执行流程，
     * 但是这个流程中传入的事件处理函数(中间函数)不会被执行；
     * eg: function mouseDownEventHandler(e) {
     console.log( '第二次传入独立的mousedown函数', this, e );
     }
     *$('div').on('mousedown', mouseDownEventHandler);
     * */
    function on(type, fn) {
        /*
         * 实现思路：
         * 1、遍历得到每一个元素
         * 2、获取元素的event_cache对象，如果没有初始化一个
         * 3、如果event_cache对象没有指定的事件数组，证明是第一次绑定该事件，
         * 需要调用原生方法绑定事件，传入的事件处理函数是一个中间函数，
         * 这个中间函数负责按照顺序执行事件数组中所有的函数。
         * 4、获取event_cache对象中指定事件的数组，如果没有初始化一个
         * 5、把fn存储到对应的事件数组中
         * 6、链式编程返回this
         * */
        this.each(function () {

            var self = this;

            self.event_cache = self.event_cache || {};

            if (!self.event_cache[type]) {

                self.event_cache[type] = [];

                addEvent(self,type,function(e){

                    $.each(self.event_cache[type],function(k){

                        self.event_cache[type][k].call( self,e);

                    })

                })

            }

            self.event_cache[ type ].push( fn );

        })

        return this;

    };
    /*
     * off:
     * 不传参，解除所有的事件；
     * 传入1个参数，解除指定的事件；
     * 传入2个参数，解除指定的事件中的指定事件处理函数。
     *   //$('div').off('mousedown', mouseDownEventHandler);
     * */
    function off( type, fn ) {
        /*
         * 实现思路：
         * 1、遍历得到每一个元素
         * 2、如果元素没有event_cache对象不用做处理
         * 3、如果没有传参，遍历每一个事件数组，分别清空
         * 4、如果传了1个参数，清空指定的事件数组
         * 5、如果传了2个参数，遍历对应的事件数组，删除对应的函数(记住要全部遍历判断每一个函数)
         * 6、链式编程返回this
         * */
        var len=arguments.length,arg=arguments;
        this.each(function(){
            var self=this;
            var temp=self.event_cache;
            if(!temp){
                return;
            }else{
                if(len===0){
                    for(var k in temp){
                        temp[k]=='';
                    }
                }else if(len===1){
                    temp[arg[0]]='';
                }else if(len===2){

                }

            }
        });
    }


    var jQuery = function (select) {
        return new jQuery.fn.init(select);
    };

//给原型一个简称
    jQuery.fn = jQuery.prototype = {
        constructor: jQuery,
//以下暴露出对jQuey暴露在外界函数体(init函数体)的操作方法
//            替换后原型要手动添加constructor指向jQuery
        jQuery: '1.0.0',
        length: 0,//让你变成一个伪数组
        //css:css,
        // 有则删除，没则添加
        toggleClass: function( classNames ) {

            classNames = classNames.split(' ');

            // 遍历所有元素
            this.each(function() {
                var $self = jQuery( this );

                // 遍历所有的toggleClass
                $.each(classNames, function( i, toggleClass ) {

                    // 有则删除，没则添加
                    if( $self.hasClass( toggleClass ) ){
                        $self.removeClass( toggleClass );
                    }else {
                        $self.addClass( toggleClass );
                    }
                });
            });

            // 链式编程
            return this;
        },
        //19.(在自己的后面添加兄弟节点)
        after: function(sibling){
            var $sibling = jQuery(sibling);
            $sibling.insertAfter(this);
            return this;
        },
        get: function (i) {
            /*
             * 实现思路：
             * 1、没有传参，借用slice方法把实例对象转换为数组返回
             * 2、传参，正数或0按照指定下标返回，非正数倒着返回。
             * var arr=[1,1,2,2,3,34,4];console.log(arr.slice())  slice不传参数 就返回完整的数组， 改变它的指向让一个伪数组返回一个数组
             * */
            if (arguments.length === 0) {
                return slice.call(this);
            } else if (isNumber(i)) {
                return i >= 0 ? this[i] : this[this.length + i];
            }
        },

        eq: function (i) {
            /*
             * 实现思路：
             * 1、正数或0按照指定下标获取对应的元素，非正数倒着获取对应的元素
             * 2、然后把获取到的元素包装成jQ对象返回 // 并且这个新实例还记录了上一级链。
             * */
           return  this.pushStack( i >= 0? this[ i ]: this[ this.length + i ]);

        },
        _eq: function (i) {
       //return  jQuery(this.get(i))
       //     return this.pushStack(this.get(i))
         return   this.pushStack(this.get(i))
        },
        pushStack: function( arr ) {
            /*
             * pushStack方法内部会新创建一个JQ实例，
             * 然后给这个新实例添加一个preObj属性记录该方法的调用者,
             * 最后返回这个新实例
             * */
            var $new = jQuery( arr );
            $new.preObj = this; // 这里的this，谁调用pushStack就指向谁。
            return $new;
        },
        first: function () {
            return this.eq(0);
        },
        last: function () {
            return this.eq(-1);
        },
        toArray: function () {
            return slice.call(this);
        },
        slice: function (start,end) {
            /*
             * 实现思路：
             * 1、复用数组的slice方法截取jQ实例
             * 2、把截取到的jQ实例包装返回
             * */
          return this.pushStack(slice.call(this,start,end));
        },
        push: function () {
           return this.pushStack(push.apply(this,arguments)) ;
        },
        _push:push,
        end: function () {
            return this.preObj;
        },
        each: function( fn ) {
            return each( this, fn );
        },
        map: function (fn) {
            return map(this,fn);
        }



    };
    var init = jQuery.fn.init = function (select) {
        // 如果参数转换为布尔不为false，则进一步判断
        if (select) {
            // 如果参数为函数
            if (isFunction(select)) {
                //DOM树构建完毕再执行这个函数
                ready(select);
            }
            // 如果参数为字符串，则进一步判断
            else if (isString(select)) {
                // 如果是html字符串，创建对应的元素，然后把这些元素依次添加到实例中
                if (isHTML(select)) {
                    push.apply(this, parseHTML(select));
                } else {
                    // 否则认为是选择器，去页面中获取元素，把获取到的元素依次添加到实例中
                    push.apply(this, document.querySelectorAll(select));
                }
            }
            // 如果是数组或伪数组，把这些元素依次添加到实例中
            else if (isArrayLike(select)) {
                try {
                    push.apply(this, select)
                } catch (e) {
                    push.apply(this, slice.call(this, select))
                }
            }
            //DOM元素 或其他
            else {
                push.call( this, select );
            }
        }


    };
    init.prototype = jQuery.fn;
    window.$ = window.jQuery = jQuery;
    // 给jQ自己和原型分别添加extend方法
    // 传入2个参数，第二个对象混入到第一个对象中，
    // 传入1个参数，把对象混入到this中。
    //想了  把它加到哪了  因为jQuery是一个函数，只能访问函数里面return的东西不能给函数添加；
    //jQuery的原型也只能被jQuery实例访问；jQuery直接访问不到原型里面的东西  外面调用的$() 就是在内部new过的实例
    //实例相当于一个对象 给实例添加一个方法实际上就等于给对象添加了键值对，对原本的构造函数没影响
    //$调用的是静态方法  给jQuery添加的也是静态方法 用console.dir(jQuery)可以访问到参数里面所有的数据 就可以看到添加的静态方法在里面
    jQuery.extend = jQuery.fn.extend = function () {
        var arg = arguments, len = arg.length;
        // 默认认为会传入多个参数，所以从1开始遍历得到后面的每一个对象
        var i = 1, key;
        var target = arg[0];  // 默认认为会传入多个参数，所以目的为第一个对象

        // 如果只有1个参数，那么目标改为this，遍历的i就从第一个对象开始了，所以改为0。
        if( len === 1 ) {
            target = this;
            i = 0;
        }
        // 得到后面的每一个对象
        for( ; i < len; i++ ) {
            // 得到每一个对象自己的成员
            for( key in arg[ i ] ) {
                if( arg[i].hasOwnProperty( key ) ) {
                    target[ key ] = arg[ i ][ key ]
                }
            }
        }
        // 给谁混入返回谁
        return target;
    };

    jQuery.extend({
        css:css,
        isHTML:isHTML,
        val:val
    });
    jQuery.fn.extend({
        isString:isString,
        parseHTML:parseHTML,
        css:css,
        val:val,
        attr:attr,
        prop:prop,
        html:html,
        text:text,
        appendTo:appendTo,
        remove:remove,
        prependTo:prependTo,
        append:append,
        insertBefore:insertBefore,
        before:before,
        insertAfter:insertAfter,
        next:next,
        on:on
    })

})(window);




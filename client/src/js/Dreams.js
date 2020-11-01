class Dream {

    /* -------------------------- CLASS CONSTRUCTOR -------------------------- */

    constructor( props ) {
        this.elements = props.getAll ? props.elements : [ props.elements[ props.index ] ];
        this.selector = props.selector;
        this.root = ( props.elements[0] === window || props.elements[0] === document ) ? true : false;
        this.length = props.length;
        this.length = props.elements.length;
        this.single = props.elements.length === 1;
        this.first = props.elements[0];
    }


    /* -------------------------- CYCLE METHODS -------------------------- */

    // Cycle Back
    cycle() {
        return new Dream({
            elements: this.elements,
            selector: this.selector,
            getAll: true,
            index: 0
        });
    }


    // Cycle Back With New Elements And Selectors
    newCycle( elements, selector ) {
        return new Dream({
            elements,
            selector: selector ? selector : this.selector,
            getAll: true,
            index: 0
        });
    }




    /* -------------------------- DOM TREE METHOEDS -------------------------- */

    // Return Elements
    nodes() {
        return this.single ? this.first : this.elements;
    }

    
    e() {
        return this.single ? this.first : this.elements;
    }


    // Remove Elements
    remove() {

        this.elements.forEach( e => e.parentElement.removeChild( e ) );

    }


    // Remove Inner Elements
    clear() {
        this.elements.forEach( e => e.innerHTML = "" );
        return this.cycle();
    }


    // Get Ancestor Element
    ancestor( level = 0 ) {

        const ancestors = [];

        this.elements.forEach( element => {

            let e = element.parentElement;

            for ( let i = 0; i < level; i++) {

                e = e.parentElement;

            }

            ancestors.push( e );

        });

        return this.newCycle( ancestors, `ancestor of "${this.selector}"` );

    }


    // Shortcut To Get Direct Parent From Ancestor Class
    parent() {

        return this.ancestor( 1 );

    }

    
    // Returns an Array of All other nodes
    siblings() {

        const family = [];


        this.elements.map( brother => {

            let sister = brother.parentElement.firstChild;

            while ( sister ) {

                if ( sister !== brother && sister.nodeType === Node.ELEMENT_NODE ) family.push( sister );

                sister = sister.nextElementSibling || sister.nextSibling;

            }

        });


        return this.newCycle( family, `siblings of "${this.selector}"` );
    }


    // Execute Query Selector On Children Or Return All Children
    children( selector ) {

        let nodes = [];

        if ( selector ) {

            this.elements.forEach(element => {
                nodes = nodes.concat( 
                    Array.from( element.querySelectorAll( selector ) ) 
                );
            });   

        }

        else {

            this.elements.forEach(element => {
                nodes = nodes.concat( 
                    Array.from( element.children ) 
                );
            });

        }


        return this.newCycle( nodes, selector ? selector : `children of "${this.selector}"`  );

    }


    // Insert HTML Markup
    insert( content, position = "beforeend" ) {

        this.elements.forEach( e =>  e.insertAdjacentHTML( position, content ) );

        return this.cycle();

    }


    // Append Children To Nodes
    append( nodes ) {

        const list = ( nodes instanceof Dream ) ? nodes.elements : [ nodes ];

        // Loop Thorugh And Append Children
        this.elements.forEach( ( e, index ) => {

            list.forEach( li => {
                e.appendChild( ( list.length === 1 && !index ) ? li : li.cloneNode(true) );
            });

        });

        return this.cycle();
    }


    pop() {
        this.elements.forEach(e => e.removeChild(e.lastChild));
    }

    idx(idx) {
        const node = [this.elements[idx]];

        return this.newCycle(node, this.selector);

    }





    /* -------------------------- ELEMENT PROPERTIES -------------------------- */


    // Convert Shorthand Keys
    static getElementKey( value ) {

        let key;

        switch ( value ) {

            case "html":
                key = "innerHTML";
                break;

            case "text":
                key = "textContent";
                break;

            case "top":
                key = "offsetTop";
                break;

            case "height":
                key = "offsetHeight";

            default:
                key = value;

        }

        return key;

    }


    // Parse Values
    static parse( type, value ) {

        switch ( type.toLowerCase() ) {

            case "int": case "i":
                return parseInt( value );
                break;
            
            case "float": case "f":
                return parseFloat( value );
                break;

            case "json":
                return JSON.parse( value );
                break;

            default:
                return value;

        }

    }


    // Get Property Value
    get( attr = "value", parse ) {

        const key = this.constructor.getElementKey( attr );

        const values = this.elements.map( e => parse ? this.constructor.parse( parse, e[key] ) : e[ key ] );

        return this.single ? values[0] : values;

    }


    // Set Property Value
    set( attr, value ) {

        const key = this.constructor.getElementKey( attr );

        this.elements.forEach(e => e.setAttribute(key, value));

        return this;

    }


    // Get Value Of Element
    val( parse ) {

        return this.get('value', parse);
        //return value !== undefined || value !== null ? this.set( "value", value ) : this.get( "value", parse );
        
    }


    setVal(value) {
        return this.set('value', value);
    }


    has(attr) {
        const retrieve = e => {

            return e.hasAttribute(attr);

        }

        return this.single ? retrieve( this.first ) : this.elements.map( e => retrieve( e ) );
    }


    // Set Data Attributes
    setData( attr, value ) {

        this.elements.forEach( e => e.dataset[ attr ] = value );

        return this.cycle();

    }


    // Access Dataset Shortcut
    data( attr = null, parse ) {

        const retrieve = e => {

            const data = e.dataset[attr];


            return attr ? (parse && data ? this.constructor.parse(parse, data) : data) : e.dataset;

        }

        return this.single ? retrieve( this.first ) : this.elements.map( e => retrieve( e ) );
    }


    // Get Height Of Element
    height( unit = 0 ) {

        const heightOf = e => e.offsetHeight + unit;

        return this.single ? heightOf( this.first ) : this.elements.map( e => heightOf( e ) );

    }


    // Get The Top Of The Element
    top( unit = 0 ) {

        const topOf = e => e.offsetTop + unit;

        return this.single ? topOf( this.first ) : this.elements.map( e => topOf( e ) );

    }


    // Get Window Position
    position() {
        return this.single ? this.first.getBoundingClientRect() : this.elements.map( e => e.getBoundingClientRect() );
    }


    // Set HTML Content Shortcut
    html( content, value ) {

        if ( !content ) return this.get( "innerHTML" );

        if ( Array.isArray( content ) ) this.elements.forEach( ( e, i ) => { e.innerHTML = content[i] });

        else this.elements.forEach( e => { e.innerHTML = content });

        return this.cycle();
    }


    // Set TextContent Shortcut
    text( content, value ) {

        if ( !content ) return this.get( "textContent" );

        if ( Array.isArray( content ) ) this.elements.forEach( ( e, i ) => { e.textContent = content[i] });

        else this.elements.forEach( e => { e.textContent = content });

        return this.cycle();

    }




    /* -------------------------- ELEMENT STYLE METHODS -------------------------- */

    // Set Timeout Shortcut
    static timeout(ms) {
        return new Promise( resolve => setTimeout( resolve, ms ) );
    }


    // Get Transition Event Name
    static getTransitionEndEventName() {

        const transitions = {
            "transition"      : "transitionend",
            "OTransition"     : "oTransitionEnd",
            "MozTransition"   : "transitionend",
            "WebkitTransition": "webkitTransitionEnd"
        }

        let bodyStyle = document.body.style;

        for(let transition in transitions) {
            if(bodyStyle[transition] != undefined) {
                return transitions[transition];
            } 
        }

    }



    clearClassList() {

        this.elements.forEach(e => Array.from(e.classList).forEach(className => e.classList.remove(className)));
        return this;

    }
    

    // Add Classes
    addClass(classNames) {

        this.elements.forEach(e => classNames.split(' ').forEach(className => e.classList.add(className)));
        return this;

    }


    // Remove Classes
    removeClass(classNames) {

        this.elements.forEach(e => classNames.split(' ').forEach(className => e.classList.remove(className)));
        return this;

    }


    // Toggle A Class
    toggle( name, force ) {

        this.elements.forEach( e => e.classList.toggle( name, force ) );

        return this.cycle();

    }


    // Set CSS Properties
    css( properties ) {

        this.elements.forEach( e => Object.assign( e.style, properties ) );

        return this.cycle();

    }


    // Wait For Transitions To End 
    async transition( style ) {

        // 1. Get Transitionend Event Name
        const endEvent = this.constructor.getTransitionEndEventName();


        // 2. Get Length Of Element Lists
        let length = this.elements.length;


        // 3. Await All Transitions To Complete
        await new Promise( resolve => {

            // Count Number Of Completed Animations
            let t = 0;

            // Function That Resolves Promise When Complete
            const trackEvents = () => {
                t++;
                if ( t === length ) resolve();
            }

            // Loop Through Elements And Listen From Transitions
            this.elements.forEach( element => {

                // Convert Transition Duration To Number
                const duration = parseFloat( window.getComputedStyle(element).getPropertyValue('transition-duration').replace("s", "") );

                // If No Transition Shorten Length Of Elements
                if ( !duration ) return length--;
        
                // Devine Event Listener
                const finished = e => {
                    element.removeEventListener('transitionend', finished);
                    trackEvents();
                }
        
                // Attach Event Listener
                element.addEventListener('transitionend', finished);

            });

            // Apply Desired CSS Properties
            this.css( style );


            // If No Elements Have Transitions Then Immediately Resolve
            if ( !length ) resolve();
    
        });


        // For Debugging Purposes
        //console.log('all animations completed');


        // 4. Return Cycle
        return this.cycle();
    }


    // Hide Item Using CSS Property
    hide( wait = true ) {
        if ( !this.length ) return Promise.resolve();
        const style = {"opacity": "0"};
        return wait ? this.transition( style ) : this.css( style );
    }


    // Show Item Using Css Property
    show( wait = true ) {
        if ( !this.length ) return Promise.resolve();
        const style = {"opacity": "1"};
        return wait ? this.transition( style ) : this.css( style );
    }



    

    /* -------------------------- EVENT LISTENER METHODS -------------------------- */

    // Attach Event Listeners
    on( eventType, eventAction ) {
        this.elements.forEach(element => {
            eventType.split(" ").forEach(event => {
                element.addEventListener(event, eventAction);
            });
        });
        return this.cycle();
    }

    kill() {

        this.elements = this.elements.map(el => {
            const clone = el.cloneNode(true);
            el.parentNode.replaceChild(clone, el);
            return clone;
        });

        return this.cycle();
    }


    // Remove Event Listeners
    off(shallow) {
        this.elements.forEach( element => element.removeEventListener( eventType, eventAction ));

        // this.elements.forEach(element => {

        //     let clone;

        //     if (!shallow) {
        //         clone = element.cloneNode(true);
        //     }

        //     else {
        //         clone = element.cloneNode(false);
        //         while (element.hasChildNodes()) clone.appendChild(element.firstChild);
        //     }
            
        //     element.parentNode.replaceChild(clone, element);
            
        // });

        return this;
    }


    // Prevent Default Action
    prevent( event, eventAction ) {

        const action = eventAction ? e => {
            e.preventDefault();
            eventAction( e );
        } : e => e.preventDefault();

        return this.on( event, action );

    }


    // Click Action Shortcut
    click( action ) {
        return this.on( "click", action );
    }

    
    // Attach Event Listener To Parent
    listenFor(eventTypes, selector, eventAction) {

        // Potential use of closest method. more research is needed

        // Loop Through And Delegate Events
        this.elements.forEach( parent => {

            // Filter Event Targets
            const delegate = event => {

                // Get Potential Target Nodes
                const nodes = parent.querySelectorAll( selector );
    
                const target = event.target;

                nodes.forEach( node => {

                    let current = target;

                    while ( current && current !== parent ) {
                        
                        if ( current === node ) {
                            if(event.stopPropogation) event.stopPropogation();
                            return eventAction.call( node, event );
                        }

                        current = current.parentNode;

                    }

                });
    
            }

            eventTypes.split(' ').forEach(event => parent.addEventListener(event, delegate))


        });

        // Return Function To Be Chained
        return this.cycle();
    }


    // Dispath An Event
    dispatch( event ) {
        this.elements.forEach( element => element.dispatchEvent( event ) );
        return this.cycle();
    }


    // On Resize
    onresize(callback, bind) {

        const observer = new ResizeObserver(bind ? callback : () => callback());

        this.elements.forEach(element => {
            observer.observe(element);
        });

        return this;
    }




    /* -------------------------- ELEMENT ARRAY METHODS -------------------------- */

    // Iterate Over Function
    forEach( fn ) {
        this.elements.forEach( fn );
        return this.cycle();
    }


    // Map Function Values
    map( fn ) {

        return this.elements.map( fn );

    }


    // Filter Function
    filter( test ) {
        this.elements = Array.from( this.elements ).filter( test );
        this.length = this.elements.length;
        return this;
    }


    concat(otherDream) {
        return this.newCycle(this.elements.concat(otherDream.elements), `${this.selector || ''}${this.selector ? ', ' : ' '}${otherDream.selector || ''}`);
    }




    /* -------------------------- OTHER METHODS -------------------------- */

    // Delay Events
    async delay( time ) {
        await this.constructor.timeout(time);
        return this.cycle();
    }


    // Selector Shortcut
    static select( selector ) {

        return Array.from( document.querySelectorAll( selector ) );

    }

}


// Create Timer class
class Timer {

    constructor( threshold = 2000 ) {

        this.threshold = threshold;
        this.timeout = null;
      
    }

    start( callback ) {
        this.initial = new Date();

        if ( !callback ) return;

        clearTimeout( this.timeout );
        this.timeout = setTimeout( callback, this.threshold );
    }

    stop() {
        this.final = new Date();
        this.elapsed = this.final - this.initial;
        this.remaining = ( this.elapsed >= this.threshold ) ? 0 : ( this.threshold - this.elapsed );
    }

    async hold() {
        this.stop();
        if ( this.remaining ) await Dream.timeout(this.remaining);
        return true;
    }

    reset() {
        this.elapsed = 0;
        this.remaining = 0;
    }

}


// Initialize New Dom Class
const initDream = ( selector, index ) => {

    const isElement = ( typeof selector === 'object' );

    return new Dream({
        elements: isElement ? ( selector.length ? selector : [ selector ] ) : Dream.select( selector ),
        selector: isElement ? null : selector,
        getAll: isElement ? true : ( ( index || index === 0 ) ? false : true ),
        index: index
    });

};


// Export Async Delay Function
initDream.delay = async ( time, content = true ) => {

    await Dream.timeout(time);

    return content;

};


// Convert HTML String To Dream Class
initDream.html = markup => {

    const html = markup.trim();
    const template = document.createElement('template');
    template.innerHTML = html;


    return new Dream({
        elements: Array.from( template.content.children ),
        selector: null,
        getAll: true,
        index: null
    });

}




// Link Timer Class To Dreams
initDream.timer = threshold => new Timer(threshold);


// Check For Instance Of Dream
initDream.dreaming = obj => obj instanceof Dream;


// Loop Through Opject
initDream.each = (obj, fx) => {

    for (const [key, value] of Object.entries(obj)) {
        fx(key, value);
    }
}



// Export Shortcut Class
export const dream = initDream;


// // Export Dollar Format
// export const usd = ( x, prefix, suffix ) => {

//     if ( !x ) return `${!prefix ? "" : prefix }0.00${!suffix ? "" : suffix}`;

//     return `${(x < 0) ? "-" : ""}${ !prefix ? "" : prefix }${Array.from( Math.abs(x).toFixed(2).split(".")[0] ).reverse().map( ( int, i, d ) => ( ( ( i + 1 ) % 3 ) === 0 && i !== ( d.length - 1 ) ) ? `,${int}` : int ).reverse().join("")}.${x.toFixed(2).split(".")[1]}${!suffix ? "" : suffix}`;

// };




/* Copyright 2020 Arjun Samir Patel
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
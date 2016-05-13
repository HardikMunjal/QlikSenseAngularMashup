/*
 * Bootstrap-based responsive mashup
 * @owner Enter you name here (xxx)
 */
/*
 *    Fill in host and port for Qlik engine
 */
var prefix = window.location.pathname.substr( 0, window.location.pathname.toLowerCase().lastIndexOf( "/extensions" ) + 1 );

var config = {
	host: window.location.hostname,
	prefix: prefix,
	port: window.location.port,
	isSecure: window.location.protocol === "https:"
};
//to avoid errors in dev-hub: you can remove this when you have added an app
var app;
require.config( {
	baseUrl: (config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "" ) + config.prefix + "resources"
} );

require( ["js/qlik"], function ( qlik ) {

	var control = false;
	qlik.setOnError( function ( error ) {
		$( '#popupText' ).append( error.message + "<br>" );
		if ( !control ) {
			control = true;
			$( '#popup' ).delay( 1000 ).fadeIn( 1000 ).delay( 11000 ).fadeOut( 1000 );
		}
	} );
	$( "body" ).css( "overflow: hidden;" );
	function AppUi ( app ) {
		var me = this;
		this.app = app;




		// bootsrap code
		Direction = {
    LEFT : 'left',
    RIGHT : 'right'
}

Shoji = function(element) {
    this.offset = 0;
    var shoji = $(element)
    var door = shoji.find('.shoji-door');
    this.getDoor = function() { return door; };
    var leftPanel = shoji.find('.shoji-panel-left');
    this.getLeftPanel = function() { return leftPanel; };
    var rightPanel = shoji.find('.shoji-panel-right');
    this.getRightPanel = function() { return rightPanel; };
};

Shoji.prototype.slide = function(direction, width, duration, complete) {
    var operator;
    var offset;
    switch (direction) {
    case Direction.LEFT:
        operator = '-=';
        offset = -width;
        break;
    case Direction.RIGHT:
        operator = '+=';
        offset = width;
        break;
    default:
        return;
    }
    this.getDoor().animate({ left: operator + width }, duration, 'linear', complete);
    this.offset += offset;
};

Shoji.prototype.toggle = function(direction, duration) {
    var offset = this.offset;
    var leftPanel = this.getLeftPanel();
    var rightPanel = this.getRightPanel();
    switch (direction) {
    case Direction.LEFT:
        if (offset < 0) { // left
            this.slide(Direction.RIGHT, -offset, duration, function() { rightPanel.hide(); });
        } else if (offset == 0) { // docked
            rightPanel.show();
            this.slide(Direction.LEFT, rightPanel.width(), duration);
        } else if (offset > 0) { // right
            this.slide(Direction.LEFT, offset, duration, function() {
                leftPanel.hide();
                rightPanel.show();
                this.slide(Direction.LEFT, rightPanel.width(), duration);
            });
        }
        break;
    case Direction.RIGHT:
        if (offset < 0) { // left
            this.slide(Direction.RIGHT, -offset, duration, function() {
                rightPanel.hide();
                leftPanel.show();
                this.slide(Direction.RIGHT, leftPanel.width(), duration);
            });
        } else if (offset == 0) { // docked
            leftPanel.show();
            this.slide(Direction.RIGHT, leftPanel.width(), duration);
        } else if (offset > 0) { // right
            this.slide(Direction.LEFT, offset, duration, function() { leftPanel.hide(); });
        }
        break;
    }
};

$(function() {
    var shoji = new Shoji('#shoji');
    $('[data-slide]').click(function() { shoji.toggle($(this).data('slide'), 130); });
});
//end
		app.global.isPersonalMode( function ( reply ) {
			me.isPersonalMode = reply.qReturn;
		} );
		app.getAppLayout( function ( layout ) {
			$( "#title" ).html( layout.qTitle );
			$( "#title" ).attr( "title", "Last reload:" + layout.qLastReloadTime.replace( /T/, ' ' ).replace( /Z/, ' ' ) );
			//TODO: bootstrap tooltip ??
		} );
		app.getList( 'SelectionObject', function ( reply ) {
			$( "[data-qcmd='back']" ).parent().toggleClass( 'disabled', reply.qSelectionObject.qBackCount < 1 );
			$( "[data-qcmd='forward']" ).parent().toggleClass( 'disabled', reply.qSelectionObject.qForwardCount < 1 );
		} );
		app.getList( "BookmarkList", function ( reply ) {
			var str = "";
			reply.qBookmarkList.qItems.forEach( function ( value ) {
				if ( value.qData.title ) {
					str += '<li><a data-id="' + value.qInfo.qId + '">' + value.qData.title + '</a></li>';
				}
			} );
			str += '<li><a data-cmd="create">Create</a></li>';
			$( '#qbmlist' ).html( str ).find( 'a' ).on( 'click', function () {
				var id = $( this ).data( 'id' );
				if ( id ) {
					app.bookmark.apply( id );
				} else {
					var cmd = $( this ).data( 'cmd' );
					if ( cmd === "create" ) {
						$( '#createBmModal' ).modal();
					}
				}
			} );
		} );
		$( "[data-qcmd]" ).on( 'click', function () {
			var $element = $( this );
			switch ( $element.data( 'qcmd' ) ) {
				//app level commands
				case 'clearAll':
					app.clearAll();
					break;
				case 'back':
					app.back();
					break;
				case 'forward':
					app.forward();
					break;
				case 'lockAll':
					app.lockAll();
					break;
				case 'unlockAll':
					app.unlockAll();
					break;
				case 'createBm':
					var title = $( "#bmtitle" ).val(), desc = $( "#bmdesc" ).val();
					app.bookmark.create( title, desc );
					$( '#createBmModal' ).modal( 'hide' );
					break;
			}
		} );
	}

	//callbacks -- inserted here --
	//open apps -- inserted here --

	//get objects -- inserted here --
	//create cubes and lists -- inserted here --
	if ( app ) {
		new AppUi( app );
	}

} );


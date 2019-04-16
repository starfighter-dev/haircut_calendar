/* Martin's HairCut Calendar (requires jQuery) */
function haircut_calendar (container) {

   // Define at will. Replace with languified overrides in your own code.
   this.month_names = ["January","February","March","April","May","June","July","August","September","October","November","December"];
   this.day_names   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
   this.day_names_long   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

   // Internal stuff you can play with, but might not want to.
   this.month           = 0; // you can pass in a starting month, or default to now
   this.year            = 0; // same with year.
   this.container       = container;
   this.title_container = 0; // Pass in an ID if you want to provide your own title div
   this.daycnt          = 0;

   // Set these from your calling code if you want to set certain ranges
   this.min_month      = 0;
   this.min_year       = 0;
   this.max_month      = 0;
   this.max_year       = 0;
   this.min_days_after = 0; // Minimum number of days to display after month end

   // Set this if you want extra rows before and after
   this.weeks_before = 0;
   this.weeks_after  = 0;

   // Store the visible start and end dates of the calendar
   this.start_date_iso = '1978-10-28';
   this.end_date_iso   = '2078-10-28';

   // display the next month
   this.forward = function() {
      var month = this.month;
      month++;
      if ( month > 12 ) {
         this.month = 1;
         this.year++;
      } else {
         this.month = month;
      }
      this.display();
   };

   // display the previous month
   this.back = function() {
      var month = this.month;
      month--;
      if ( month < 1 ) {
         this.month = 12;
         this.year--;
      } else {
         this.month = month;
      }
      this.display();
   };

   this.get_start = function() {
      return this.start_date_iso;
   };
   this.get_end = function() {
      return this.end_date_iso;
   };

   // If the min/max dates were set, show/hide controls in here
   this.check_range = function() {
      if ( this.min_month && this.min_year ) {
         if ( this.min_year == this.year && this.min_month == this.month ) {
            jQuery(".oc-prev").hide();
         } else {
            jQuery(".oc-prev").show();
         }
      }
      if ( this.max_month && this.max_year ) {
         if ( this.max_year == this.year && this.max_month == this.month ) {
            jQuery(".oc-next").hide();
         } else {
            jQuery(".oc-next").show();
         }
      }
   };

   // Reset to 'now'
   this.reset = function() {
      this.month = 0;
      this.year  = 0;
      this.display();
   };

   // How many days are in the current month?
   this.days_in_month = function() {
      var trooper = new Date( this.year, this.month, 1 );
      trooper.setDate( trooper.getDate() - 1 );
      return trooper.getDate();
   };

   // Display the calendar
   this.display = function() {
      this.daycnt = 0;

      // If we have no current state, default to 'now'
      if ( !this.month || !this.year ) {
         var today = new Date();
         if ( !this.month ) {
            this.month = today.getMonth()+1;
         }
         if ( !this.year ) {
            this.year = today.getFullYear();
         }
      }

      // Output stream
      var html = "";

      // If you do not provide a title div, one will be provided for you
      var title = this.month_names[this.month-1]+", "+this.year;
      if ( this.title_container ) {
         jQuery('#'+this.title_container).html( title );
      } else {
         html += "<div class='oc-title'>"+title+"</div>";
      }

      html += "<table class='oc-table'><tr>";
      for ( var i = 0 ; i < this.day_names.length ; i++ ) {
         html += "<th scope='col' class='oc-day-name'>"+this.day_names[i]+"</th>";
      }
      html += "</tr>";

      // Find the first sunday before the first day of the month
      var trooper = new Date( this.year, this.month - 1, 1 );
      while ( trooper.getDay() != 0 ) {
         trooper.setDate( trooper.getDate() - 1 );
      }

      // If we have a weeks_before value, honour it
      if ( this.weeks_before ) {
         trooper.setDate( trooper.getDate() - 7 * this.weeks_before );
      }

      // trooper is now set to the last Sunday before this month, or
      // the first day of the month if it's a Sunday
      // Now loop until either the month is > than the one we want, or the year is.
      this.start_date_iso = trooper.toISOString().slice(0,10);

      while ( ( trooper.getMonth()+1 <= this.month || trooper.getMonth()+1 == 12 && this.month == 1 ) && trooper.getFullYear() <= this.year ) {
         html += this.get_html( trooper );
         this.end_date_iso = trooper.toISOString().slice(0,10);
         trooper.setDate( trooper.getDate() + 1 );
      }

      // If we haven't ended on a Saturday, continue walking until we do
      var days_after = 0;
      while ( trooper.getDay() != 0 || days_after < this.min_days_after ) {
         days_after++;
         html += this.get_html( trooper );
         this.end_date_iso = trooper.toISOString().slice(0,10);
         trooper.setDate( trooper.getDate() + 1 );
      }

      // If we have a weeks_after value, honour it
      if ( this.weeks_after ) {
         var req_days = 7 * this.weeks_after;
         for( var i = 0; i < req_days ; i++ ) {
            html += this.get_html( trooper );
            this.end_date_iso = trooper.toISOString().slice(0,10);
            trooper.setDate( trooper.getDate() + 1 );
         }
      }

      html += "</tr>";
      html += "</table>";

      this.check_range();

      // output to whatever container we were given
      jQuery('#'+this.container).html( html );
   };

   // Wipe out the display
   this.clear_content = function() {
      jQuery('.oc-daycontent').html('');
   };

   // Return a row of days
   this.get_html = function( trooper ) {
      var ochtml = '';
      this.daycnt++;
      if ( this.daycnt > 7 ) {
         this.daycnt = 1;
         ochtml += "</tr><tr>";
      }

      // Create an ID so we can trigger stuff
      var id = this.iso_from_date( trooper );

      // Create a td for the day, and set up classes as active or inactive
      var day = trooper.getDate();
      var active_or_inactive = trooper.getMonth()+1 == this.month ? 'active' : 'inactive';
      var can_tab = trooper.getMonth()+1 == this.month ? 'tabindex=0' : '';
      ochtml += "<td class='oc-day oc-day-"+active_or_inactive+"' data-date="+id+" id='oc-"+id+"'><div "+can_tab+" role='link' aria-label='"+this.ariaLabel(id)+"' data-aria-label='"+this.ariaLabel(id)+"'><div class='oc-daynumber'>"+day+"</div><div class='oc-daycontent oc-daycontent-'"+active_or_inactive+" id='oc-day-"+id+"'></div></div></td>";
      return ochtml;
   };

   // Return a JS date object from yyyy-mm-dd input
   this.date_from_iso = function( datestr ) {
      var spalol = datestr.split('-');
      var dt     = new Date(spalol[0], spalol[1]-1, spalol[2]);
      return dt;
   };

   // Return an ISO YYYY-MM-DD string from a date object
   this.iso_from_date = function( dateobj ) {
      return dateobj.toISOString().slice(0,10);
   };

   // Display the current state in a friendly form
   this.toString = function() {
      var month = this.month;
      if ( month.toString().length == 1 ) {
         month = "0"+month;
      }
      return this.year+"-"+month;
   };

   this.ariaLabel = function( datestr ) {
      var spalol = datestr.split('-');
      var dt     = new Date(spalol[0], spalol[1]-1, spalol[2]);
      var month  = this.month_names[dt.getMonth()]; 
      var day    = this.day_names_long[dt.getDay()]; 
      var title  = spalol[2]+" "+month+" "+spalol[0]+" "+day;
      return title;
   };

}

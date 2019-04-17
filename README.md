# haircut_calendar
Super simple, expandable JavaScript calendar.

View demos: https://www.starfighter.dev/github/haircut_calendar/demo/

## What is is?

Just displays a nice calendar. You can set some parameters to define what people can do with it, set minimum dates and things like that. It's super simple, so if you want it to do more - just make it do more.

### Requirements

* jQuery

## Options

You should check out the demo HTML files for some good examples.

### Create the calendar

You should have a div in which to put the calendar, and it should have some snazzy ID set.

```
   var calendar             = new haircut_calendar('snazzy-id');
   calendar.title_container = 'calendar-title'; // If you want a title
```

If you have a container for the title, set it as above. The title is the current month and year.

### Display the calendar

You should set all required parameters before displaying it, but when you're ready, just do this:

```
   calendar.display();
```

### Minimum / Maximum dates

You can set minimum and maximum dates like this:

```
   calendar.min_year  = 1978;
   calendar.min_month = 10;
   calendar.max_year  = 2978;
   calendar.max_month = 10;
```

If your 'back/forward' buttons use the .hc-prev and .hc-next classes, they'll automatically be hidden when required.

### Default date

The default date will always be based on today's date. If you'd like something else set, try this:

```
   calendar.year = 2025;
   calendar.month = 2;
```

### Trailing days

For some uses, you may want to always show X days after any day. Think of, for example, a hotel booking that spans 5 days - you'd always want those 5 days to be displayed after every date on the calendar. You can do this with the min_days_after setting:

```
   calendar.min_days_after = 5;
```

### Handling back/next months

The simplest way is to set up two divs, one with the .hc-back class, and one with .hc-next. You can then handle it like this:

```
   $('.hc-prev').click(function() {
      calendar.back();
   });
   $('.hc-next').click(function() {
      calendar.forward();
   });
```

### Handling somebody clicking a day

To do this, just attach an event to the 'click' trigger for the .hc-day class. Note: When the month changes, you'll have to readd the trigger to the new day elements.

```
   $('.hc-day').click(function() {
      $(this).addClass('hc-selected');
      var day = $(this).data('date');
      alert(day);
   });
```

The date attribute comes back as YYYY-MM-DD.

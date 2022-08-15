/** Send spam summaries to another user. Version 1.0.0 / 2017-01-21 */
function sendSpamSummary() {
  var target_email = "user@example.com";
  var active_email = Session.getActiveUser().getEmail();
 
  if (target_email === active_email) {
    Logger.log("This is already target account.");
    return
  }
  
  Logger.log("This is user: " + active_email);
  
  var count = GmailApp.getSpamUnreadCount();
  if (count === 0) {
    Logger.log("No spam.");
    return;
  }
  
  var label = GmailApp.getUserLabelByName("spam-notified");
  if (!label) {
    label = GmailApp.createLabel("spam-notified");
  }
  
  var subjects = [];
  var threads = GmailApp.getSpamThreads();
  threads.forEach(function(th) {
    if ( th.getLabels().map(function(l) { return l.getName().toLowerCase(); }).indexOf('spam-notified') < 0) {
      subjects.push( "  * " + th.getFirstMessageSubject());
      th.addLabel(label);
    }
  });

  if (subjects.length === 0) {
    Logger.log("No new spam.");
    return;
  }
  
  var body = "You have new unread SPAM:\n\n";
  body += subjects.join('\n');
  body += "\n";
  body += "-- \n";
  body += "HG's Google App Script\n";
  
  GmailApp.sendEmail(target_email, "New spam in " + active_email, body);
  Logger.log("Sent summary to " + target_email);
}

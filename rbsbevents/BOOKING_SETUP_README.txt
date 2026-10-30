RBSB EVENTS - BOOKING PHASE 1 SETUP

WHAT CHANGED
- booking.html now imports your existing Firebase config.
- A booking requires a signed-in Firebase user.
- It writes to bookings/<Firebase UID>/<booking ID>.
- Booking status starts as pending; emailStatus starts as not_sent.
- It shows an animated success popup only after Firebase confirms the write.
- If Firebase rules block the write, it displays an error instead of falsely claiming success.

IMPORTANT: Your current Realtime Database rules deny writes. Do NOT make the database publicly writable. Before testing bookings, update Rules using the secure template below and then press Publish.

SECURE RULES TEMPLATE
This template assumes the admin's Firebase Authentication UID is stored as true at /admins/<UID>, which matches the lower-case admins node visible in your screenshot. Confirm that UID is the same UID the admin actually uses to sign into Firebase Authentication.

{
  "rules": {
    ".read": false,
    ".write": false,
    "bookings": {
      ".read": "auth != null && root.child('admins').child(auth.uid).val() === true",
      "$uid": {
        ".read": "auth != null && (auth.uid === $uid || root.child('admins').child(auth.uid).val() === true)",
        ".write": "auth != null && (auth.uid === $uid || root.child('admins').child(auth.uid).val() === true)"
      }
    },
    "admins": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": false
      }
    }
  }
}

Before replacing existing rules, preserve any other rules your project needs for events, venues, or services. This template only covers bookings and the existing admins UID lookup. If your admin is still using the hardcoded admin-login page and is NOT signed into Firebase Authentication, admin database access will not work until the admin login is secured and connected to Firebase Auth.

TESTING
1. Back up your current rules before editing.
2. Confirm the admin's real Firebase Auth UID and that /admins/<UID> is true.
3. Publish the rules.
4. Serve the website from a web server/hosting (not by opening the HTML as a file).
5. Sign in as a normal user, open booking.html, and submit a test booking.
6. In Realtime Database, check /bookings/<your UID>/<booking ID>.

This phase does not yet send emails or connect the admin table to live bookings. Email sending must be implemented securely on a trusted backend; do not place email-service secrets in browser JavaScript.

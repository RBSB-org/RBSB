
(function () {
    emailjs.init({
        publicKey: "RXumA3BYxAlTfoZRO"
    });
})();

window.sendBookingConfirmation = async function (booking) {
    try {
        if (typeof emailjs === "undefined") {
            throw new Error("EmailJS library is not loaded.");
        }

        if (!booking || !booking.customerEmail) {
            throw new Error("Customer email address is missing.");
        }

        const response = await emailjs.send(
            "service_u0tfit1",
            "template_k2aw30i",
            {
                to_email: booking.customerEmail,
                user_name: booking.customerName || "Customer",
                event_name: booking.eventName || "Your Event",
                booking_id: booking.bookingId || "N/A",
                booking_status: booking.status || "Pending"
            }
        );

        console.log(
            "Booking confirmation email sent:",
            response.status
        );

        return true;
    } catch (error) {
        console.error(
            "Booking confirmation email failed:",
            error
        );

        return false;
    }
};

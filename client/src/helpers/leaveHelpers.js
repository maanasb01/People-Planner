export const formatDate = (date, type) => {
    if (!date) return "Select the Month and Year";
    let options;
  
    if (type === "getFullDay") {
      options = { year: "numeric", month: "short", day: "numeric" };
    } else if (type === "getTime") {
      options = { hour: "numeric", minute: "numeric", hour12: true };
    } else {
      options = { year: "numeric", month: "long" };
    }
    return new Intl.DateTimeFormat("en-GB", options).format(new Date(date));
  };
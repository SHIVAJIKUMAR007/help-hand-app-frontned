import * as FileSystem from "expo-file-system";

export const timeToAgo = (ms) => {
  const periods = {
    year: 12 * 30 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    min: 60 * 1000,
    second: 1000,
  };

  const diff = Date.now() - ms;

  if (diff > periods.year) {
    return Math.floor(diff / periods.year) + " year ago";
  } else if (diff > periods.month) {
    return Math.floor(diff / periods.month) + " month ago";
  } else if (diff > periods.week) {
    return Math.floor(diff / periods.week) + " week ago";
  } else if (diff > periods.day) {
    return Math.floor(diff / periods.day) + " day ago";
  } else if (diff > periods.hour) {
    return Math.floor(diff / periods.hour) + " hour ago";
  } else if (diff > periods.min) {
    return Math.floor(diff / periods.min) + " min ago";
  } else if (diff > periods.second) {
    return Math.floor(diff / periods.second) + " second ago";
  } else {
    return "Just Now";
  }
};

export const checkFileSize = async (fileURI) => {
  const fileSizeInBytes = await FileSystem.getInfoAsync(fileURI);
  return fileSizeInBytes;
};
export const numberToK = (num) => {
  const number = {
    k: 1000,
    m: 1000000,
    b: 1000000000,
  };
  if (num > number.b) {
    const b = Math.floor(num / number.b);

    if (b < 10) {
      let result = Math.floor((num * 10) / number.b);
      let afterDeci = result - b * 10;
      return b + "." + afterDeci + "B";
    }
    return b + "B";
  } else if (num > number.m) {
    const m = Math.floor(num / number.m);

    if (m < 10) {
      let result = Math.floor((num * 10) / number.m);
      let afterDeci = result - m * 10;
      return m + "." + afterDeci + "M";
    }
    return m + "M";
  } else if (num > number.k) {
    const k = Math.floor(num / number.k);

    if (k < 10) {
      let result = Math.floor((num * 10) / number.k);
      let afterDeci = result - k * 10;
      return k + "." + afterDeci + "K";
    }
    return k + "K";
  } else {
    return num;
  }
};

export const roundOff = (a, b) => {
  if (a === 0 || b === 0) {
    return 3;
  }
  let result = a / b;
  let floor = Math.floor(result);

  let deci = result - floor;

  if (deci >= 0.5) {
    return floor + 1;
  }
  return floor;
};

export function isElementInViewport(el) {
  var height = el?.offsetHeight;

  var rect = el?.getBoundingClientRect();

  return (
    rect?.top >= 0 &&
    rect?.left >= 0 &&
    rect?.bottom <=
      (window.innerHeight + height / 2 ||
        document.documentElement.clientHeight +
          height / 2) /* or $(window).height() */ &&
    rect?.right <=
      (window.innerWidth ||
        document.documentElement.clientWidth) /* or $(window).width() */
  );
}

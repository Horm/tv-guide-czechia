import {formatDateForCzechTV} from "../src/czech-tv"
import {sampleCzechTVGuide} from "./helpers"
import moment from "moment"


test('formatDateForCzechTV should return date param in dd.mm.YYYY', () => {
    const dateObject = new Date("2019-07-19T19:30:46.132Z")
    expect(formatDateForCzechTV(dateObject)).toBe("19.07.2019");
});

function getLastShowIndexBeforeMidnight(guide) {
    // .... ,18:30, 22:00, 23:30, 0:30, ....

    const sortedGuide = guide
        .map((value, index) => {
            return {time: value.cas, index: index}
        })
        .sort((first, second) => {
            return isTimeSameOrBefore(first.time, second.time)
        })

    return sortedGuide[sortedGuide.length - 1].index
}

function getCurrentShow(guide, time) {
    let lastShowIndex = getLastShowIndexBeforeMidnight(guide);
    let showsBeforeMidnight = guide.slice(0, lastShowIndex);
    let showsAfterMidnight = guide.slice(lastShowIndex, guide.length);



    let filtered = showsBeforeMidnight.filter(value => !isTimeAfter(time, value.cas));
    return filtered[filtered.length - 1];

}

function filterOldShows(guide, time) {
    return [getCurrentShow(guide, time), ...guide.filter(value => isTimeAfter(time, value.cas))]
}

function getHoursFromTimeString(time) {
    return parseInt(time.substr(0, 2));
}


function getMinutesFromTimeString(time) {

    if (time.length > 4) {
        return parseInt(time.substr(3, 2));
    } else {

        return parseInt(time.substr(2, 2));
    }
}

function getTimeFromString(time) {
    return {
        hours: getHoursFromTimeString(time),
        minutes: getMinutesFromTimeString(time),
    }
}

function getMomentFromTimeString(time) {
    let result = moment();
    result.set({
        hours: getHoursFromTimeString(time),
        minutes: getMinutesFromTimeString(time),
        seconds: 0,
        milliseconds: 0
    });
    return result
}

function isTimeAfter(currentTime, timeToCompare) {
    return !isTimeSameOrBefore(currentTime, timeToCompare)
}

function isTimeSameOrBefore(currentTime, timeToCompare) {
    const current = getTimeFromString(currentTime)
    const toCompare = getTimeFromString(timeToCompare)

    if (current.hours === toCompare.hours) {
        return current.minutes >= toCompare.minutes
    } else if (current.hours >= toCompare.hours) {
        return true
    }
    return false
}

it('should return hours from time string', () => {

    expect(getHoursFromTimeString("6:30")).toEqual(6);
    expect(getHoursFromTimeString("18:30")).toEqual(18);

});

it('should return minutes from time string', () => {

    expect(getMinutesFromTimeString("6:30")).toEqual(30);
    expect(getMinutesFromTimeString("18:35")).toEqual(35);

});

it('should return moment from this day but with param time', () => {
    let result = getMomentFromTimeString("6:30");

    let expectedMoment = moment();

    expectedMoment.hours(6)
    expectedMoment.minutes(30)
    expectedMoment.seconds(0)
    expectedMoment.milliseconds(0)
    expect(result).toEqual(expectedMoment)
});




test('isTimeSameOrBefore should return true for 6:30 and 2019-05-19T06:30:00.132Z', () => {
    expect(isTimeSameOrBefore("6:30", "6:30")).toBe(true)
    expect(isTimeSameOrBefore("6:30", "06:25")).toBe(true)
    expect(isTimeSameOrBefore("7:30", "6:30")).toBe(true)
    expect(isTimeSameOrBefore("6:30", "6:35")).toBe(false)
    expect(isTimeSameOrBefore("6:30", "6:25")).toBe(true)
    expect(isTimeSameOrBefore("6:30", "8:25")).toBe(false)
})

it('should return current show', () => {
    expect(getCurrentShow(sampleCzechTVGuide.porad, "6:25").cas).toEqual("06:25");

});
test('filterOldShows should return guide without old shows', () => {
    let result = filterOldShows(sampleCzechTVGuide.porad, "6:30");
    console.log(result);
    expect(result.length).not.toBe(0);
    expect(result[0].nazvy.nazev).toBe("Spáč");
});



// sets logging level
var VERBOSE = false

if (typeof NON_ENGLISH_LOCALE === 'undefined') {
    var NON_ENGLISH_LOCALE = false
}

// return whether the container is already covered
function alreadyCovered(container) {
    return (container.find(".KAB_adBlockerCover").length > 0)
}

// true if we want to overlay non-ads as well
var showNonAd = false;

// return whether the container is already covered by the same type
// of container. That is, if there is already an ad or non-ad container
// we don't want to ad a container of a new type, but if an adchoices
// icon has been added and it changed from non-ad to ad, we do want
// to update.
function alreadyCoveredSameType(container, newCoverIsAd) {
    var alreadyCovered = (container.find(".KAB_adBlockerCover").length > 0)
    var alreadyAd = (container.find(".KAB_isAnAd").length > 0)
    return alreadyCovered && (alreadyAd || !newCoverIsAd)
}

// Add a cover with "THIS IS AN AD" and the "Sponsored" text in the given
// locale's language (if non-english).
// container is the container to cover.
// coverText is the text to show on the cover
// matchingText only has a value if we are on Facebook in a non-english locale.
// deepestOnly is true if we only want to include the deepest cover for this
// area.
// isAd is true if it is an ad
// hasInterval is true if there is an interval check associated with this cover
// intervalID is the id of that interval
function coverContainer(container, coverText, matchingText, deepestOnly, isAd, hasInterval, intervalID) {
    // if we aren't doing anything to non-ads and this isn't an ad, do nothing.
    if (!isAd && !showNonAd) {
        return false
    }

    // don't cover if this container is already covered;
    if (alreadyCoveredSameType(container, false)) {
        return false
    }

    // remove any existing covers (if we are moving from non-ad to ad)
    container.find(".KAB_adBlockerCover").remove()

    // vary the color and classes based on whether this is an ad or not.
    var color
    var classes = "KAB_adBlockerCover"
    if (isAd) {
        if (showNonAd) {
            color = "rgba(255, 0, 0, 0.8)"
        } else {
            color = "rgba(255, 255, 255, 0.8)"
        }
        classes += " KAB_isAnAd"
    } else {
        color = "rgba(255, 255, 255, 0.8)"
    }

    // some google ads have a height of 0 and then everything in overflow,
    // so if that is the case set the height of the cover to be the overflow
    // height.
    var setHeight
    var containerHeight = container.height()
    var containerScrollHeight = container.prop('scrollHeight')
    if (containerHeight == 0 && containerScrollHeight > 0) {
        setHeight = containerScrollHeight + "px"
    } else {
        setHeight = "100%"
    }

    //Kemono images
    var imageSrcs = [
        "https://pbs.twimg.com/media/C46fOL7VcAAM4H-.jpg",
        "https://pbs.twimg.com/media/C5cdRXyUoAEQ8HK.jpg",
        "https://pbs.twimg.com/media/C7rkymbVwAAE11F.jpg",
        "https://pbs.twimg.com/media/C7HmZy4VAAETPGR.jpg",
        "https://pbs.twimg.com/media/C7Hmew-UwAEOBox.jpg",
        "https://pbs.twimg.com/media/C6ispvmVwAAKLvZ.jpg",
        "https://pbs.twimg.com/media/C6issRcV0AIXjll.jpg",
        "https://pbs.twimg.com/media/C5-jiooUsAAmOJy.jpg",
        "https://pbs.twimg.com/media/C5-jlo2UYAAIVcT.jpg",
        "https://pbs.twimg.com/media/C5atYAoUwAAoEBz.jpg",
        "https://pbs.twimg.com/media/C5atflpUYAADBbS.jpg",
        "https://pbs.twimg.com/media/C5atg0BUoAA_zNu.jpg",
        "https://pbs.twimg.com/media/C42iwUAUoAAY8HV.jpg",
        "https://pbs.twimg.com/media/C42iyZtUcAAof4R.jpg",
        "https://pbs.twimg.com/media/C42i0tqUEAEOffq.jpg",
        "https://pbs.twimg.com/media/C4nf2a-VcAMGy-3.jpg",
        "https://pbs.twimg.com/media/C3t7WvCVcAAsBoo.jpg",
        "https://pbs.twimg.com/media/C3t7a5LVYAAl2Kd.jpg",
        "https://pbs.twimg.com/media/C3KH9iQVMAIIgda.jpg",
        "https://pbs.twimg.com/media/C2h5KX4UcAID-Fe.jpg",
        "https://pbs.twimg.com/media/C2h5WoJUcAA-qF_.jpg",
        "https://pbs.twimg.com/media/C2h5XxQUQAALHkl.jpg"
    ];
    imgSrc = imageSrcs[Math.floor(Math.random() * imageSrcs.length)]

    // create the cover to prepend.
    var prepend = "<div class=\"" + classes + "\" style=\"height: " + setHeight + ";position: absolute;width: 100%; color:white; background-color: " + color + " !important; opacity: 0.9; z-index: 100; visibility: visible; display:flex; display:flex; flex-direction:column; justify-content:center; align-items:center; flex-wrap:nowrap; overflow: hidden; \">"
    prepend += "<div id=\"KAB_filter\" style=\"position: absolute;height:100%; width:100%; background-image: url(" + imgSrc + "); background-position: center; background-size:cover; background-color:rgba(0,0,0,0.3); display:flex;\">"
    prepend += "</div>"
    prepend += "<style>#KAB_filter{filter:brightness(0.5);} #KAB_filter:hover{opacity:0.7;filter:blur(7px) brightness(0.4);}</style>"
    prepend += "<div class=\"KAB_closeButton\" style=\"position: absolute; right: 5px; top: 5px; cursor: pointer; padding: 0px 3px; border: 1px solid black; border-radius: 5px;\">"
    prepend += "<strong>"
    prepend += "X"
    prepend += "</strong>"
    prepend += "</div>"
    prepend += "<div style=\"position: absolute; width: 100%; text-align:center;\">"
    prepend += "<span style=\"font-size:40px;\">"
    prepend += "わーい！廣告！"
    prepend += "</span>"
    prepend += "<br/>"
        // if we have "Sponsored" text in another language, add it below "THIS IS AN AD"
    if (NON_ENGLISH_LOCALE && matchingText !== "") {
        if (matchingText == "贊助") {
            prepend += "<br/>"
            prepend += "<span style=\"font-size:60px; font-weight:bold; letter-spacing: 15px;\">"
            prepend += "提供"
            prepend += "</span>"
            prepend += "<br/>"
            prepend += "<span style=\"font-size:40px;\">"
            prepend += "Facebook 粉絲專頁贊助"
            prepend += "</span>"
        } else {
            prepend += "<br/>"
            prepend += "<span style=\"font-size:40px; letter-spacing: 15px;\">"
            prepend += matchingText
            prepend += "</span>"
        }
    }
    prepend += "</div>"
    prepend += "</div>"
    var myPrepend = prepend
        // if we only want the deepest, remove any above this
    if (deepestOnly) {
        container.parents().each(function(index) {
            $(this).children(".KAB_adBlockerCover").remove()
        })
    }
    // if we only want the deepest covers and there is a cover within
    // this container already, don't ad this cover.
    if (!deepestOnly || !(container.find(".KAB_adBlockerCover").length > 0)) {
        // prepend the cover
        container.css("position", "relative")
        container.prepend(myPrepend)

        // make sure the close button closes the cover
        container.children().children(".KAB_closeButton").on("click", function() {
            container.children(".KAB_adBlockerCover").css("visibility", "hidden")
        });
    }


    // if this is an ad and we have an interval, stop the search for ads.
    if (hasInterval && isAd) {
        clearInterval(intervalID)
    }
}
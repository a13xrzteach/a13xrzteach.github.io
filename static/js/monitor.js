var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var RNG = function (min, max) {
    return Math.round(Math.random() * (max - min)) + min;
};
var Section = /** @class */ (function () {
    function Section(elementId) {
        this.elementId = elementId;
        this.element = document.getElementById(elementId);
    }
    return Section;
}());
var ImageSection = /** @class */ (function (_super) {
    __extends(ImageSection, _super);
    function ImageSection(elementId, config) {
        var _this = _super.call(this, elementId) || this;
        // imageIndex keeps track of the current index within the this.images array
        // of which image is displayed. This is entirely managed by the JavaScript
        // code and not extracted from the JSON.
        _this.imageIndex = 0;
        _this.images = config.images;
        _this.imageInterval = config.image_interval;
        _this.init();
        return _this;
    }
    // Get a valid string to use as a background-image CSS property
    ImageSection.prototype.getCSSImageUrl = function () {
        var localPath = this.images[this.imageIndex];
        return "url(/static/img/monitor/".concat(localPath, ")");
    };
    // Increment imageIndex to loop across the images array, updating the image
    ImageSection.prototype.nextImage = function () {
        this.imageIndex = (this.imageIndex + 1) % this.images.length;
        this.element.style.backgroundImage = this.getCSSImageUrl();
    };
    ImageSection.prototype.init = function () {
        var _this = this;
        setInterval(function () { return _this.nextImage(); }, this.imageInterval * 1000);
        this.element.style.backgroundSize = "contain";
        this.element.style.backgroundRepeat = "no-repeat";
        this.element.style.backgroundPosition = "center";
        // nextImage increments the index by 1 and we want to start at 0
        this.imageIndex = -1;
        this.nextImage();
    };
    return ImageSection;
}(Section));
var YouTubeSection = /** @class */ (function (_super) {
    __extends(YouTubeSection, _super);
    function YouTubeSection(elementId, config) {
        var _this = _super.call(this, elementId) || this;
        _this.resourceId = config.resource_id;
        _this.type = config.type;
        _this.init();
        return _this;
    }
    YouTubeSection.prototype.init = function () {
        // Create a wrapper for the YouTube API to place the video inside
        var ytContainer = document.createElement("div");
        var ytContainerId = "yt-".concat(this.elementId);
        ytContainer.id = ytContainerId;
        this.element.appendChild(ytContainer);
        // https://developers.google.com/youtube/player_parameters
        var playerVars = {
            // Set which second to start at - we want to play from the start of
            // the video
            start: 0,
            autoplay: 1,
            controls: 1,
            loop: 1,
            // The video has to be explicitly muted for autoplaying to work
            mute: 1,
            // Show captions by default
            cc_load_policy: 1,
        };
        var playerOptions = {
            playerVars: playerVars,
            events: {
                onReady: function () { },
                // https://developers.google.com/youtube/iframe_api_reference#onError
                onError: function (event) {
                    console.log("Received error from YouTube API");
                    console.log(event);
                }
            },
        };
        if (this.type == "youtube_video") {
            playerOptions.videoId = this.resourceId;
            playerVars.playlist = this.resourceId;
        }
        else if (this.type == "youtube_playlist") {
            playerVars.list = this.resourceId;
            playerVars.listType = "playlist";
        }
        else
            console.error("Invalid YouTubeSection type", this.type);
        var player = new YT.Player(ytContainerId, playerOptions);
    };
    return YouTubeSection;
}(Section));
var AnnouncementsSection = /** @class */ (function (_super) {
    __extends(AnnouncementsSection, _super);
    function AnnouncementsSection(elementId) {
        var _this = _super.call(this, elementId) || this;
        _this.announcements = [];
        _this.announcementsIndex = -1;
        _this.textElement = document.createElement("p");
        // Look for new announcements around every 10 minutes
        _this.fetchInterval = 10 * 60 * 1000;
        // Original dimensions of the container
        // If we increase our container past them, our font size has gotten too large
        _this.originalWidth = 0;
        _this.originalHeight = 0;
        _this.init();
        return _this;
    }
    AnnouncementsSection.prototype.updateAnnouncements = function () {
        return __awaiter(this, void 0, void 0, function () {
            var raw, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fetch("/announcements")];
                    case 1:
                        raw = _b.sent();
                        _a = this;
                        return [4 /*yield*/, raw.json()];
                    case 2:
                        _a.announcements = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Increment font size recursively until we've started exceeding the size of
    // the container
    // (Recursion is requirement for school assignment)
    AnnouncementsSection.prototype.setTextSize = function (fontSize) {
        this.textElement.style.fontSize = fontSize + "px";
        if (this.element.clientHeight > this.originalHeight ||
            this.element.clientWidth > this.originalWidth ||
            this.textElement.scrollWidth > this.originalWidth ||
            this.textElement.scrollHeight > this.originalHeight) {
            this.textElement.style.fontSize = (fontSize - 1) + "px";
            return;
        }
        this.setTextSize(fontSize + 1);
    };
    AnnouncementsSection.prototype.setAnnouncement = function (text) {
        this.textElement.innerHTML = text;
        this.setTextSize(1);
    };
    AnnouncementsSection.prototype.nextAnnouncement = function () {
        var _this = this;
        this.announcementsIndex = (this.announcementsIndex + 1) % this.announcements.length;
        var text = "".concat(this.announcementsIndex + 1, "/").concat(this.announcements.length);
        text = "".concat(text, ": ").concat(this.announcements[this.announcementsIndex]);
        this.setAnnouncement(text);
        var updateDelay = text.length * 75 + 1000;
        setTimeout(function () { return _this.nextAnnouncement(); }, updateDelay);
    };
    AnnouncementsSection.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateAnnouncements()];
                    case 1:
                        _a.sent();
                        this.fetchInterval = this.fetchInterval * RNG(75, 125) / 100;
                        setInterval(function () { return _this.updateAnnouncements(); }, this.fetchInterval);
                        this.element.style.display = "grid";
                        this.textElement.className = "announcement";
                        this.originalWidth = this.element.clientWidth;
                        this.originalHeight = this.element.clientHeight;
                        this.element.appendChild(this.textElement);
                        this.nextAnnouncement();
                        return [2 /*return*/];
                }
            });
        });
    };
    return AnnouncementsSection;
}(Section));
var InfoSection = /** @class */ (function (_super) {
    __extends(InfoSection, _super);
    function InfoSection(elementId) {
        var _this = _super.call(this, elementId) || this;
        // School location
        _this.latitude = 44.03254035352888;
        _this.longitude = -79.48015624518095;
        _this.data = {
            temperature: 0,
            relativeHumidity: 0,
            precipitationProbability: 0,
            precipitation: 0,
        };
        _this.originalWidth = 0;
        _this.originalHeight = 0;
        // Fetch every 30 minutes to avoid getting rate limited by OpenMeteo
        _this.fetchInterval = 30 * 60 * 1000;
        _this.init();
        return _this;
    }
    InfoSection.prototype.getAPIUrl = function () {
        return "https://api.open-meteo.com/v1/forecast?latitude=".concat(this.latitude, "&longitude=").concat(this.longitude, "&current=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation&timezone=America%2FNew_York");
    };
    InfoSection.prototype.updateData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var raw, json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("infoSection: fetching API data");
                        return [4 /*yield*/, fetch(this.getAPIUrl())];
                    case 1:
                        raw = _a.sent();
                        return [4 /*yield*/, raw.json()];
                    case 2:
                        json = _a.sent();
                        json = json.current;
                        this.data["temperature"] = json.temperature_2m;
                        this.data["relativeHumidity"] = json.relative_humidity_2m;
                        this.data["precipitationProbability"] = json.precipitation_probability;
                        this.data["precipitation"] = json.precipitation;
                        return [2 /*return*/];
                }
            });
        });
    };
    InfoSection.prototype.addStat = function (ul, key, name, unit) {
        var li = document.createElement("li");
        ul.appendChild(li);
        var value = this.data[key];
        li.innerHTML = "".concat(name, ": ").concat(value, " ").concat(unit);
    };
    InfoSection.prototype.setTextSize = function (fontSize) {
        this.element.style.fontSize = fontSize + "px";
        if (this.element.clientHeight > this.originalHeight ||
            this.element.clientWidth > this.originalWidth ||
            this.element.scrollWidth > this.originalWidth ||
            this.element.scrollHeight > this.originalHeight) {
            this.element.style.fontSize = (fontSize - 1) + "px";
            return;
        }
        this.setTextSize(fontSize + 1);
    };
    InfoSection.prototype.updateDisplay = function () {
        Array.from(this.element.children).forEach(function (el) { return el.remove(); });
        var ul = document.createElement("ul");
        this.element.appendChild(ul);
        var li;
        li = document.createElement("li");
        ul.appendChild(li);
        var dateOptions = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        li.innerHTML = new Date().toLocaleDateString("en-CA", dateOptions);
        li = document.createElement("li");
        ul.appendChild(li);
        li.innerHTML = new Date().toLocaleTimeString("en-US");
        this.addStat(ul, "temperature", "Temperature", "°C");
        this.addStat(ul, "relativeHumidity", "Relative Humidity", "%");
        this.addStat(ul, "precipitationProbability", "Probability of precipitation", "%");
        this.addStat(ul, "precipitation", "Precipitation", "mm");
        this.setTextSize(1);
    };
    InfoSection.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.element.className = "info";
                        this.originalWidth = this.element.clientWidth;
                        this.originalHeight = this.element.clientHeight;
                        return [4 /*yield*/, this.updateData()];
                    case 1:
                        _a.sent();
                        this.updateDisplay();
                        setInterval(function () { return _this.updateData(); }, this.fetchInterval);
                        setInterval(function () { return _this.updateDisplay(); }, 1000);
                        return [2 /*return*/];
                }
            });
        });
    };
    return InfoSection;
}(Section));
var Monitor = /** @class */ (function () {
    function Monitor() {
        this.sections = [];
    }
    Monitor.prototype.getConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            var raw, config;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("/config")];
                    case 1:
                        raw = _a.sent();
                        return [4 /*yield*/, raw.json()];
                    case 2:
                        config = _a.sent();
                        return [2 /*return*/, config];
                }
            });
        });
    };
    Monitor.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var config, sectionId, section, sectionConfig, sectionConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getConfig()];
                    case 1:
                        config = _a.sent();
                        // The only sectionIds we expect are mirrored in monitor.html:
                        // main, footer, sidebar
                        for (sectionId in config) {
                            section = void 0;
                            if (config[sectionId].type == "image_cycle") {
                                sectionConfig = config[sectionId];
                                section = new ImageSection(sectionId, sectionConfig);
                            }
                            else if (config[sectionId].type == "youtube_video" ||
                                config[sectionId].type == "youtube_playlist") {
                                sectionConfig = config[sectionId];
                                section = new YouTubeSection(sectionId, sectionConfig);
                            }
                            else if (config[sectionId].type == "announcements")
                                section = new AnnouncementsSection(sectionId);
                            else if (config[sectionId].type == "info")
                                section = new InfoSection(sectionId);
                            else {
                                alert("Error: Invalid section configuration. See the JS console.");
                                console.error(sectionId);
                                console.error(config);
                                return [2 /*return*/];
                            }
                            this.sections.push(section);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return Monitor;
}());
// It's easier to have everything configured together at once, so let's wait
// until the YouTube API is ready too, even if we're not using it.
// This doesn't load with an arrow function.
function onYouTubePlayerAPIReady() {
    return __awaiter(this, void 0, void 0, function () {
        var monitor;
        return __generator(this, function (_a) {
            monitor = new Monitor();
            monitor.init();
            return [2 /*return*/];
        });
    });
}

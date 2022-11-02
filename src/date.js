
export function getFullDate() {
    // Ex: year/month/day/hour:minutes:second
    const date = new Date();

    const seconds = ("0" + date.getSeconds()).slice(-2)
    const minutes = ("0" + date.getMinutes()).slice(-2) + ":"
    const hours = ("0" + date.getHours()).slice(-2) + ":"
    const day = ("0" + date.getDate()).slice(-2) + "/"
    const month = ("0" + (date.getMonth() + 1)).slice(-2) + "/"
    const year = date.getFullYear() + "/"

    const fullDate = year + month + day + hours + minutes + seconds
    return fullDate
}

export function getFullDateWithSpace() {
    // Ex: day/month/year hour:minutes:second
    const date = new Date();

    const seconds = ("0" + date.getSeconds()).slice(-2)
    const minutes = ("0" + date.getMinutes()).slice(-2) + ":"
    const hours = ("0" + date.getHours()).slice(-2) + ":"
    const day = ("0" + date.getDate()).slice(-2) + " "
    const month = ("0" + (date.getMonth() + 1)).slice(-2) + "/"
    const year = date.getFullYear() + "/"

    const fullDate = day + month + year + hours + minutes + seconds
    return fullDate
}



export function getDate() {
    // Ex: year/month/day
    const dateClass = new Date();

    const day = ("0" + dateClass.getDate()).slice(-2) + "/"
    const month = ("0" + (dateClass.getMonth() + 1)).slice(-2) + "/"
    const year = dateClass.getFullYear()

    const date = day + month + year
    return date
}

export function getTime() {
    // Ex: hour:minutes
    const date = new Date();

    const minutes = ("0" + date.getMinutes()).slice(-2)
    const hours = ("0" + date.getHours()).slice(-2) + ":"

    const time = hours + minutes
    return time
}



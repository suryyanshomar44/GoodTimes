const categorydata = [
    {
        category: "Technology",
        subcategory: []
    },
    {
        category: "Scifi",
        subcategory: []
    },
    {
        category: "Educational",
        subcategory: []
    },
    {
        category: "Horror",
        subcategory: []
    },
    {
        category: "Drama",
        subcategory: []
    },
    {
        category: "Kids",
        subcategory: []
    }
]


const todayDate = (date2) => {
    console.log('gsfgd',date2)
    let date = date2 ? date2 : new Date();
    const year = date.getFullYear();
    let month;
    if (date.getMonth() + 1 >= 10) {
      month = `${date.getMonth() + 1}`;
    } else {
      month = `0${date.getMonth() + 1}`;
    }
    let date1 = date.getDate();
    if (date1 < 10) {
      date1 = `0${date1}`;
    }
    return `${year}-${month}-${date1}`;
  }

module.exports = {
    categorydata,
    todayDate
}
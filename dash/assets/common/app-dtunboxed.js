const itemsPerPage = 10;
let data = [];
let totalPages = 0;
let currentPage = 1;

async function fetchData() {
  try {
    const pathApi =
      "https://api.trendflow-ai.com/api/zocial-data-entries?populate=*&sort=total_engagement:desc&pagination[pageSize]=100&filters[$and][0][date][$gte]=2023-09-29T17:00:00.000Z&filters[$and][1][hashtag][$eq]=DigitalTourismUnboxed";

    const response = await fetch(pathApi);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    data = await response.json();
    totalPages = Math.ceil(data.data.length / itemsPerPage);
    displayDataInTable(currentPage);
    displayPageNumbers();
    sumTotalEngagement();
    // sumTotalPrint();
    sumTotalHashtag();
    sumTotalPost();
    topFive();
    countPositive();
    const positiveCountResult = countPositive();
    const neutralCountResult = countNeutral();
    const negativeCountResult = countNegative();

    console.log("positive", positiveCountResult);
    console.log("neutral", neutralCountResult);
    console.log("negative", negativeCountResult);

    const facebookCouunt = countFacebook();
    const instagramCount = countInstagram();

    const totalAnalysiss =
      positiveCountResult + neutralCountResult + negativeCountResult;

    const resultPositive = (positiveCountResult / totalAnalysiss) * 100;
    const percentPositive = Math.round(resultPositive);

    const resultNeutral = (neutralCountResult / totalAnalysiss) * 100;
    const percentNeutral = Math.round(resultNeutral);

    const resultNegative = (negativeCountResult / totalAnalysiss) * 100;
    const percentNegative = Math.round(resultNegative);

    chartZocial(facebookCouunt, instagramCount);
    totalAnalysis(positiveCountResult, neutralCountResult, negativeCountResult);
    sentimentAnalysis(
      percentPositive,
      percentNeutral,
      percentNegative,
      positiveCountResult,
      neutralCountResult,
      negativeCountResult
    );

    const loader = document.querySelector(".loader");
    loader.classList.add("loader--hidden");
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

// ==========================================================================================================================
// Data all total

function sumTotalEngagement() {
  const totalEngagement = data.data.reduce(
    (total, item) => total + item.attributes.total_engagement,
    0
  );

  let formattedTotalEngagement = totalEngagement;
  if (totalEngagement >= 1000000) {
    formattedTotalEngagement = (totalEngagement / 1000000).toFixed() + "m";
  } else if (totalEngagement >= 100000) {
    formattedTotalEngagement = (totalEngagement / 1000).toFixed() + "k";
  } else if (totalEngagement > 1000) {
    formattedTotalEngagement = totalEngagement.toLocaleString();
  } else {
    formattedTotalEngagement = totalEngagement.toString();
  }

  // let formattedTotalEngagement = totalEngagement;
  // if (totalEngagement >= 1000) {
  //   formattedTotalEngagement = (totalEngagement / 1000).toFixed(1) + "k";
  // }

  const totalEngagementHTML = document.getElementById("total-engagement");
  totalEngagementHTML.innerHTML = formattedTotalEngagement;
}

// function sumTotalPrint() {
//   const totalPrint = data.reduce((total, item) => total + item.print_out, 0);

//   let formattedTotalPrint = totalPrint;
//   if (totalPrint >= 1000) {
//     formattedTotalPrint = (totalPrint / 1000).toFixed(1) + "k";
//   }

//   const totalPrintHTML = document.getElementById("total-print");
//   totalPrintHTML.innerHTML = formattedTotalPrint;
// }

function sumTotalHashtag() {
  const countHashtag = data.data.length;

  let formattedTotalHashtag = countHashtag;
  if (countHashtag > 1000) {
    formattedTotalHashtag = countHashtag.toLocaleString();
  } else {
    formattedTotalHashtag = countHashtag.toString();
  }
  // let formattedTotalHashtag = countHashtag;
  // if (countHashtag >= 1000) {
  //   formattedTotalHashtag = (countHashtag / 1000).toFixed(1) + "k";
  // }

  const totalHashtag = document.getElementById("total-hashtag");
  totalHashtag.innerHTML = formattedTotalHashtag;
}

function sumTotalPost() {
  const countPost = data.data.length;

  let formattedTotalPost = countPost;
  if (countPost > 1000) {
    formattedTotalPost = countPost.toLocaleString();
  } else {
    formattedTotalPost = countPost.toString();
  }

  // let formattedTotalPost = countPost;
  // if (countPost >= 1000) {
  //   formattedTotalPost = (countPost / 1000).toFixed(1) + "k";
  // }

  const totalPost = document.getElementById("total-post");
  totalPost.innerHTML = formattedTotalPost;
}

// ==========================================================================================================================
// Format Date

function getMonthName(month) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return monthNames[month];
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const day = date.getUTCDate();
  const month = getMonthName(date.getUTCMonth());
  const year = date.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

// ==========================================================================================================================
// Top5

function topFive() {
  if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
    console.log("ไม่มีข้อมูล JSON หรือข้อมูลไม่ถูกต้อง");
    return;
  }

  const fiveItems = data.data.slice(0, 5);
  const showTopFive = document.getElementById("topFiveEngagement");
  let topFiveHTML = "";

  fiveItems.forEach((item, index) => {
    topFiveHTML += `<div class="card-content">`;
    topFiveHTML += `
    <div class="d-flex align-items-start justify-content-between mb-2">
    <div class="flex-shrink-0">
    <img src="../assets/img/icons/unicons/Ellipse-16.svg" alt="Credit Card" class="img-profile-bg" />`;
    for (let i = 1; i <= index + 1; i++) {
      topFiveHTML += `
      <img src="../assets/img/avatars/digitaltourismunboxed/top-${i}.jpg" alt="Credit Card" class="img-profile" />
      `;
    }
    // topFiveHTML += `<img src="${item.attributes.profile_pic_url.data.attributes.url}" alt="Credit Card" class="img-profile" />`;
    topFiveHTML += `</div>`;
    topFiveHTML += `
    <div class="box-title">
    <h4 class="card-title text-nowrap top5-name">${item.attributes.full_name}</h4>
    <div class="">`;
    if (item.attributes.channel == "Instagram") {
      topFiveHTML += `<span class="badge bg-label-ig me-1">${item.attributes.channel}</span>`;
    } else {
      topFiveHTML += `<span class="badge bg-label-fa me-1">${item.attributes.channel}</span>`;
    }
    const formattedDate = formatDate(item.attributes.date);
    topFiveHTML += `<span class="top5-date"> ${formattedDate}</span></div></div></div>`;
    topFiveHTML += `
    <div class="box-total-eg">
    <div class="card bg-reaction-y">
      <div class="card-total-eg-y">
        <div class="text-nowrap title-eg">Reaction</div>
        <div class="text-nowrap num-total-eg color-reaction-y">${item.attributes.reaction}</div>
      </div>
    </div>`;
    topFiveHTML += `
    <div class="card bg-comment-o">
      <div class="card-total-eg-o">
        <div class="text-nowrap title-eg">Comment</div>
        <div class="text-nowrap num-total-eg color-comment-o">${item.attributes.comment}</div>
      </div>
    </div>`;
    topFiveHTML += `
    <div class="card bg-share-g">
          <div class="card-total-eg-g">
            <div class="text-nowrap title-eg">Share</div>
            <div class="text-nowrap num-total-eg color-share-g">${item.attributes.share}</div>
          </div>
        </div>
      </div>`;
    topFiveHTML += `
    <div class="row">
        <div class="col-lg-12 -col-md-12 col-12">
          <div class="card bg-total-eg-b mt-2">
            <div class="card-total-eg-b">
              <div class="text-nowrap title-eg">Total Engagement</div>
              <div class="text-nowrap num-total-eg color-total-eg-b">${item.attributes.total_engagement}</div>
            </div>
          </div>
        </div>
      </div>`;
    topFiveHTML += `
    <div class="box-contant-eg">
    <div class="box-conntant">
      <div class="text-nowrap contant-caption">Caption</div>
      <div class="text-nowrap contant-caption-sub">${item.attributes.caption}</div>
    </div>

    <div class="box-link">
      <div class="text-nowrap contant-link">Post URL</div>
      <a href="${item.attributes.post_url}" target="_blank">
        <div class="text-nowrap contant-link-sub">${item.attributes.post_url}</div>
      </a>
    </div>
  </div>
      `;
    topFiveHTML += `</div>`;
  });
  showTopFive.innerHTML = topFiveHTML;
}

// ==========================================================================================================================
// Data Table

function displayDataInTable(page) {
  const table = document.getElementById("dataTable");
  const tbody = document.getElementById("tableBody");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  tbody.innerHTML = "";

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.data.length);

  for (let i = startIndex; i < endIndex; i++) {
    const item = data.data[i].attributes;
    const formattedDate = formatDate(item.date);
    let resultRows = "";

    resultRows += `<tr>`;
    resultRows +=
      `<td class="td-name td-h"><span class="text-limit-2-row">` +
      `${item.full_name}` +
      `</span></td>`;
    if (item.channel == "Instagram") {
      resultRows +=
        `<td><span class="badge bg-label-ig me-1">` +
        `${item.channel}` +
        `</span></td>`;
    } else {
      resultRows +=
        `<td><span class="badge bg-label-fa me-1">` +
        `${item.channel}` +
        `</span></td>`;
    }
    resultRows +=
      `<td class="td-text td-h"><span class="text-limit-2-row">` +
      `${item.caption}` +
      `</span></td>`;
    resultRows +=
      `<td class="font-12 text-center td-h">` + `${formattedDate}` + `</td>`;
    resultRows += `<td class="td-text td-h">` + `${item.reaction}` + `</td>`;
    resultRows += `<td class="td-text td-h">` + `${item.comment}` + `</td>`;
    resultRows += `<td class="td-text td-h">` + `${item.share}` + `</td>`;
    resultRows +=
      `<td class="td-text td-h">` + `${item.total_engagement}` + `</td>`;
    resultRows += `<td class="text-center td-h">`;
    resultRows +=
      `<a href="` +
      `${item.post_url}` +
      `" target="_blank" class="td-text-link"><span class="text-limit-2-row width-url">` +
      `${item.post_url}` +
      `</span></a>`;
    resultRows += `</td>`;
    resultRows += `</tr>`;

    tbody.insertAdjacentHTML("beforeend", resultRows);
  }

  if (prevBtn && nextBtn) {
    prevBtn.disabled = page === 1;
    nextBtn.disabled = page === totalPages;
  }
}

function displayPageNumbers() {
  const pageNumbersContainer = document.getElementById("pageNumbers");
  pageNumbersContainer.innerHTML = "";

  const firstPageItemHTML = `
      <li class="page-item page-hover">
        <a class="page-link border-radius fepage" href="javascript:void(0);" onclick="goToPage(1)"><i class="tf-icon bx bx-chevrons-left"></i></a>
      </li>
    `;
  pageNumbersContainer.insertAdjacentHTML("beforeend", firstPageItemHTML);

  const prevPageItemHTML = `
    <li class="page-item prev page-hover">
      <a class="page-link border-radius" href="javascript:void(0);" onclick="prevPage()"><i class="tf-icon bx bx-chevron-left"></i></a>
    </li>
  `;
  pageNumbersContainer.insertAdjacentHTML("beforeend", prevPageItemHTML);

  const maxVisiblePages = 3; // กำหนดจำนวนหน้าที่ต้องการให้แสดง
  let startPage, endPage;

  if (totalPages <= maxVisiblePages) {
    startPage = 1;
    endPage = totalPages;
  } else {
    if (currentPage <= 2) {
      startPage = 1;
      endPage = maxVisiblePages;
    } else if (currentPage + 1 >= totalPages) {
      startPage = totalPages - maxVisiblePages + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - 1;
      endPage = currentPage + 1;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageNumberItemHTML = `
      <li class="page-item ${i === currentPage ? "active" : ""} page-hover">
        <a class="page-link border-radius" href="javascript:void(0);" onclick="goToPage(${i})">${i}</a>
      </li>
    `;
    pageNumbersContainer.insertAdjacentHTML("beforeend", pageNumberItemHTML);
  }

  const nextPageItemHTML = `
    <li class="page-item next page-hover">
      <a class="page-link border-radius" href="javascript:void(0);" onclick="nextPage()"><i class="tf-icon bx bx-chevron-right"></i></a>
    </li>
  `;
  pageNumbersContainer.insertAdjacentHTML("beforeend", nextPageItemHTML);

  const lastPageItemHTML = `
      <li class="page-item page-hover">
        <a class="page-link border-radius fepage" href="javascript:void(0);" onclick="goToPage(${totalPages})"><i class="tf-icon bx bx-chevrons-right"></i></a>
      </li>
    `;
  pageNumbersContainer.insertAdjacentHTML("beforeend", lastPageItemHTML);
}

function goToPage(page) {
  currentPage = page;
  displayDataInTable(currentPage);
  displayPageNumbers();
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    displayDataInTable(currentPage);
    displayPageNumbers();
  }
}

function nextPage() {
  if (currentPage < totalPages) {
    currentPage++;
    displayDataInTable(currentPage);
    displayPageNumbers();
  }
}

// ==========================================================================================================================
// Order Statistics Chart

function countFacebook() {
  let facebookCount = 0;
  data.data.forEach((item) => {
    if (item.attributes.channel === "Facebook") {
      facebookCount++;
    }
  });

  return facebookCount;
}

function countInstagram() {
  let instagramCount = 0;
  data.data.forEach((item) => {
    if (item.attributes.channel === "Instagram") {
      instagramCount++;
    }
  });

  return instagramCount;
}

function chartZocial(facebookCount, instagramCount) {
  const chartOrderStatistics = document.querySelector("#theZocialChart"),
    orderChartConfig = {
      chart: {
        height: "280px",
        width: "100%",
        type: "donut",
      },
      labels: ["Facebook", "Instagram"],
      series: [facebookCount, instagramCount],
      colors: [config.colors.facebook, config.colors.instagram],
      stroke: {
        width: 5,
        colors: config.colors.white,
      },
      dataLabels: {
        enabled: false,
        formatter: function (val, opt) {
          return parseInt(val) + "K";
        },
      },
      legend: {
        show: false,
      },
      grid: {
        padding: {
          top: 0,
          bottom: 0,
          right: 15,
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: "80%",
            labels: {
              show: true,
              value: {
                fontSize: "22px",
                fontWeight: "700",
                color: "#353535",
                offsetY: -15,
                formatter: function (val) {
                  return parseInt(val) + "";
                },
              },
              name: {
                offsetY: 20,
              },
              total: {
                show: true,
                fontSize: "13px",
                color: "#797979",
                width: "auto",
                label: "Click to view percentage",
                formatter: function (w) {
                  w = "Channel";
                  return w;
                },
              },
            },
          },
        },
      },
    };
  if (
    typeof chartOrderStatistics !== undefined &&
    chartOrderStatistics !== null
  ) {
    const statisticsChart = new ApexCharts(
      chartOrderStatistics,
      orderChartConfig
    );
    statisticsChart.render();
  }
}

// ==========================================================================================================================
// Analysis

function countPositive() {
  let positiveCount = 0;

  data.data.forEach((item) => {
    item.attributes.sentiment.forEach((sentimentItem) => {
      if (sentimentItem.sentiment === "positive") {
        positiveCount++;
      }
    });
  });

  return positiveCount;
}

function countNeutral() {
  let neutralCount = 0;

  data.data.forEach((item) => {
    item.attributes.sentiment.forEach((sentimentItem) => {
      if (sentimentItem.sentiment === "neutral") {
        neutralCount++;
      }
    });
  });

  return neutralCount;
}

function countNegative() {
  let negativeCount = 0;

  data.data.forEach((item) => {
    item.attributes.sentiment.forEach((sentimentItem) => {
      if (sentimentItem.sentiment === "negative") {
        negativeCount++;
      }
    });
  });

  return negativeCount;
}

function totalAnalysis(
  positiveCountResult,
  neutralCountResult,
  negativeCountResult
) {
  const sumAnalysis =
    positiveCountResult + neutralCountResult + negativeCountResult;
  const showAnalysis = document.getElementById("total-analysis");
  showAnalysis.innerHTML = sumAnalysis;
}

function sentimentAnalysis(
  percentPositive,
  percentNeutral,
  percentNegative,
  positiveCountResult,
  neutralCountResult,
  negativeCountResult
) {
  const showSentimentAnalysis = document.getElementById("show-analysis");
  let dataAnalysis = "";
  if (percentNegative !== 0) {
    dataAnalysis += `
    <div class="progress-bar bg-nagative shadow-none" role="progressbar" style="width: ${percentNegative}%" aria-valuenow="${percentNegative}" aria-valuemin="0" aria-valuemax="100">
    ${percentNegative}%
    </div>
    `;
  } else {
    dataAnalysis += ``;
  }

  if (percentNeutral !== 0) {
    dataAnalysis += `
    <div class="progress-bar bg-neutral shadow-none" role="progressbar" style="width: ${percentNeutral}%" aria-valuenow="${percentNeutral}" aria-valuemin="0" aria-valuemax="100">
    ${percentNeutral}%
    </div>
    `;
  } else {
    dataAnalysis += ``;
  }

  if (percentPositive !== 0) {
    dataAnalysis += `
    <div class="progress-bar bg-positive shadow-none progress-hover" role="progressbar" style="width: ${percentPositive}%" aria-valuenow="${percentPositive}" aria-valuemin="0" aria-valuemax="100">
    ${percentPositive}%
    <span class="tooltip">20%</span>
    </div>
    `;
  } else {
    dataAnalysis += ``;
  }

  showSentimentAnalysis.innerHTML = dataAnalysis;
}

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
});

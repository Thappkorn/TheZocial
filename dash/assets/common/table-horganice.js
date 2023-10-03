document.addEventListener("DOMContentLoaded", init, false);

const pathJson = "../assets/json/data_horganice.json";
const tableId = "#tableList";
const pageSize = 10;

let link = document.getElementsByClassName("page-item");
let data, table, sortCol, active;
let sortAsc = false;
let curPage = 1;

async function init() {
  table = document.querySelector(`${tableId} tbody`);
  active = document.querySelector("#activeLink");
  let resp = await fetch(pathJson);
  data = await resp.json();

  renderTable();

  document.querySelectorAll("#tableList thead tr th").forEach((t) => {
    t.addEventListener("click", sort, false);
  });
}

function renderTable() {
  let resultRows = "";
  let resultActives = "";

  data
    .filter((row, index) => {
      let start = (curPage - 1) * pageSize;
      let end = curPage * pageSize;
      if (index >= start && index < end) return true;
    })
    .forEach((detail) => {
      resultRows += `<tr>`;
      resultRows += `<td class="td-name">` + `${detail.full_name}` + `</td>`;
      if (detail.channel == "instagram") {
        resultRows +=
          `<td><span class="badge bg-label-ig me-1">` +
          `${detail.channel}` +
          `</span></td>`;
      } else {
        resultRows +=
          `<td><span class="badge bg-label-fa me-1">` +
          `${detail.channel}` +
          `</span></td>`;
      }
      resultRows +=
        `<td class="td-text"><span class="text-limit-3-row">` +
        `${detail.caption}` +
        `</span></td>`;
      resultRows +=
        `<td class="font-12 text-center">` + `${detail.date}` + `</td>`;
      resultRows += `<td class="td-text">` + `${detail.reaction}` + `</td>`;
      resultRows += `<td class="td-text">` + `${detail.comment}` + `</td>`;
      resultRows += `<td class="td-text">` + `${detail.share}` + `</td>`;
      resultRows +=
        `<td class="td-text">` + `${detail.total_engagement}` + `</td>`;
      resultRows += `<td class="text-center">`;
      resultRows +=
        `<a href="` +
        `${detail.post_url}` +
        `" target="_blank" class="td-text-link"><span class="text-limit-3-row width-url">` +
        `${detail.post_url}` +
        `</span></a>`;
      resultRows += `</td>`;
      resultRows += `</tr>`;
    });
  table.innerHTML = resultRows;

  resultActives += `<li class="page-item prev page-hover" onclick="prevBtn()">`;
  resultActives += `<a class="page-link border-radius"><i class="tf-icon bx bx-chevron-left"></i></a>`;
  resultActives += `</li>`;

  for (let i = 1; i < data.length / pageSize; i++) {
    resultActives += `<li class="page-item page-hover">`;
    resultActives += `<a class="page-link border-radius" onclick="activeLink(${i})">${i}</a>`;
    resultActives += `</li>`;
  }

  resultActives += `<li class="page-item next page-hover" onclick="nextBtn()">`;
  resultActives += `<a class="page-link border-radius"><i class="tf-icon bx bx-chevron-right"></i></a>`;
  resultActives += `</li>`;

  active.innerHTML = resultActives;
  link[curPage].classList.add("active");
}

function sort(e) {
  let thisSort = e.target.dataset.sort;

  if (sortCol === thisSort) sortAsc = !sortAsc;
  sortCol = thisSort;

  data.sort((a, b) => {
    if (a[sortCol] < b[sortCol]) return sortAsc ? 1 : -1;
    if (a[sortCol] > b[sortCol]) return sortAsc ? -1 : 1;

    return 0;
  });

  console.log(thisSort);

  renderTable();
}

function activeLink(pageNumber) {
  for (l of link) {
    l.classList.remove("active");
  }

  link[pageNumber].classList.add("active");
  curPage = pageNumber;

  renderTable();
}

function prevBtn() {
  if (curPage > 1) {
    for (l of link) {
      l.classList.remove("active");
    }

    curPage = curPage - 1;
    link[curPage].classList.add("active");
  }

  renderTable();
}

function nextBtn() {
  if (curPage < link.length - 2) {
    for (l of link) {
      l.classList.remove("active");
    }

    curPage = curPage + 1;
    link[curPage].classList.add("active");
  }

  renderTable();
}

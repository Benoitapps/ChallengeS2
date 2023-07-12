<script setup>
import * as d3 from "d3";
import {onMounted, computed, watch, ref} from "vue";

const props = defineProps({
  index: {
    type: Number,
    default: 0
  },
  data: {
    type: Array,
    default: () => []
  }
});

onMounted(() => {
  generateChart();

  window.addEventListener("resize", function () {
    d3.select(`#chart-${props.index}`).selectAll("*").remove();
    generateChart();
  });
});

watch(props.data, () => {
  d3.select(`#chart-${props.index}`).selectAll("*").remove();
  generateChart();
});

function generateChart() {
  console.log(props.data);
  const width = document.querySelector(".card__body").clientWidth
  const height = document.querySelector(".card__body").clientHeight - 18;
  const svg = d3.select(`#chart-${props.index}`).attr("width", width).attr("height", height);
  const g = svg.append("g");
  const parseTime = d3.utcParse("%d/%m/%Y %H:%M:%S");
  const x = d3
      .scaleTime()
      .domain(
          d3.extent(props.data, function (d) {
            return parseTime(d.date);
          })
      )
      .rangeRound([0, width]);

  const y = d3
      .scaleLinear()
      .domain(
          d3.extent(props.data, function (d) {
            return d.amount;
          })
      )
      .rangeRound([height, 0]);
  const line = d3.line()
      .x(function (d) {
        return x(parseTime(d.date));
      })
      .y(function (d) {
        return y(d.amount);
      });

  g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  g.append("path")
      .datum(props.data)
      .attr("fill", "none")
      .attr("stroke", "var(--chart-stroke)")
      .attr("stroke-width", "var(--chart-stroke-width)")
      .attr("stroke-linejoin", "round")
      .attr("d", line)
  ;
}
</script>

<template>
  <div
      class="card__body"
  >
    <svg :id="'chart-' + props.index"></svg>
  </div>
</template>

<style scoped lang="scss">
.card  {
  &__body {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
    gap: 1.25rem; // 20px

    svg {
      flex: 1;
      --chart-stroke: var(--primary);
      --chart-stroke-width: 3;
    }
  }

  &.favorite {
    svg {
      --chart-stroke: var(--secondary);
    }
  }
}
</style>
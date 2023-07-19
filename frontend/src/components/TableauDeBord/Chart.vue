<script setup>
import * as d3 from "d3";
import {onMounted, watch, ref} from "vue";

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
  if(props.data.length > 0) {
    generateChart();

    window.addEventListener("resize", function () {
      d3.select(`#chart-${props.index} svg`).selectAll("path").remove();
      generateChart();
    });
  }
  else {
    d3.select(`#chart-${props.index} [data-heading]`).text('Aucunes données enregistrées dans cette période');
  }
});

watch(props, () => {
  d3.select(`#chart-${props.index} svg`).selectAll("path").remove();

  if(props.data.length > 0) {
    generateChart();
  }
  else {
    d3.select(`#chart-${props.index} [data-heading]`).text('Aucunes données enregistrées dans cette période');
  }
});

const xMarker = ref(0);
const yMarker = ref(0);
const opacityMarker = ref(0);

let dimensions = {
  width: 0,
  height: 0,
  marginTop: 8
}

function generateChart() {
  dimensions = {
    width: document.querySelector("[data-chart]").clientWidth,
    height: document.querySelector("[data-chart]").clientHeight,
    marginTop: 8
  }

  const xAccessor = (d) => d.date = new Date(d.date)
  const yAccessor = (d) => d.amount
  const formatDate = d3.timeFormat('%d-%m-%Y')

  const getText = (data, d) => {
    const to = xAccessor(d);

    return `${formatDate(to)}`
  }

  const svg = d3
      .select(`#chart-${props.index} svg`)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .attr('viewBox', `0 0 ${dimensions.width} ${dimensions.height}`)

  const xDomain = d3.extent(props.data, xAccessor)
  const yDomain = [0, d3.max(props.data, yAccessor)]

  const xScale = d3.scaleTime()
      .domain(xDomain)
      .range([0, dimensions.width])

  const yScale = d3.scaleLinear()
      .domain(yDomain)
      .range([dimensions.height, dimensions.marginTop])

  /* Area */
  const areaGenerator = d3.area()
      .x((d) => xScale(xAccessor(d)))
      .y1((d) => yScale(yAccessor(d)))
      .y0(dimensions.height)
      .curve(d3.curveBumpX)

  const area = svg
      .insert('path', 'line')
      .datum(props.data)
      .attr('d', areaGenerator)
      .attr('fill', 'var(--chart-fill)')

  /* Line */
  const lineGenerator = d3.line()
      .x((d) => xScale(xAccessor(d)))
      .y((d) => yScale(yAccessor(d)))
      .curve(d3.curveBumpX)

  const line = svg
      .insert('path', 'line')
      .datum(props.data)
      .attr('d', lineGenerator)
      .attr('stroke', 'var(--chart-stroke)')
      .attr('stroke-width', 'var(--chart-stroke-width)')
      .attr('stroke-linejoin', 'round')
      .attr('fill', 'none')

  /* Bisector */
  const bisect = d3.bisector(xAccessor)

  /* Events */
  svg.on('mousemove', (e) => {
    if(props.data.length > 0) {
      const [posX, posY] = d3.pointer(e);
      const date = xScale.invert(posX);

      const index = bisect.center(props.data, date);
      const d = props.data[index];

      xMarker.value = xScale(xAccessor(d));
      yMarker.value = yScale(yAccessor(d));
      opacityMarker.value = 1;

      d3.select(`#chart-${props.index} [data-heading]`).text(getText(props.data, d));
      d3.select(`#chart-${props.index} [data-total]`).text(yAccessor(d));
    }
  })

  svg.on('mouseleave', () => {
    if(props.data.length > 0) {
      opacityMarker.value = 0;
      d3.select(`#chart-${props.index} [data-heading]`).text('');
      d3.select(`#chart-${props.index} [data-total]`).text('');
    }
  })
}
</script>

<template>
  <div
      class="card__body"
      :id="'chart-' + props.index"
  >
    <div class="card__body__infos">
      <h3 data-heading></h3>
      <div class="chart-info">
        <p data-total></p>
      </div>
    </div>

    <figure data-chart>
      <svg>
        <line
            :x1="xMarker"
            :x2="xMarker"
            y1="0"
            :y2="dimensions.height"
            stroke-width="var(--chart-stroke-width)"
            stroke="var(--chart-stroke)"
            :opacity="opacityMarker"
        >
        </line>
        <circle
            :cx="xMarker"
            :cy="yMarker"
            r="8"
            fill="var(--chart-stroke)"
            :opacity="opacityMarker"
        >
        </circle>
      </svg>
    </figure>
  </div>
</template>

<style scoped lang="scss">
.card  {
  &__body {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
    gap: 1.25rem; // 20px

    &__infos {
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
    }

    [data-chart] {
      flex: 1;

      svg {
        --chart-stroke: var(--primary);
        --chart-stroke-width: 3;
        --chart-fill: var(--accent);
      }
    }
  }

  &.favorite {
    .card__body {
      scrollbar-color: var(--secondary) var(--primary);

      &::-webkit-scrollbar {
        &-thumb {
          background: var(--secondary);
        }

        &-track {
          background: var(--primary);
        }
      }

      [data-chart] {
        svg {
          --chart-stroke: var(--secondary) !important;
        }
      }
    }
  }
}
</style>
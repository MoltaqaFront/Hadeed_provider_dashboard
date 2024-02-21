<template>
    <router-link :to="SectionRoute" class="chart_card">
        <!-- START:: TITLE -->
        <h5 class="chart_title m-0">
            <slot name="chart_title"></slot>
        </h5>
        <!-- END:: TITLE -->

        <!-- START:: CHART  -->
        <apexchart
            type="area"
            height="120"
            :options="areaChartOptions"
            :series="areaChartSeries"
        ></apexchart>
        <!-- END:: CHART  -->
    </router-link>
</template>

<script>
export default {
    name: "SparksAreaChart",

    props: [
        "SectionRoute",
        "ChartColor",
        "ChartTitle",
        "ChartName",
        "ChartLabels",
        "ChartData",
    ],

    data() {
        return {
            // START:: SPARKS AREA CHART DATA
            areaChartOptions: {
                chart: {
                    type: "area",
                    sparkline: {
                        enabled: true,
                    },
                },
                stroke: {
                    curve: "smooth",
                },
                title: {
                    text: this.ChartTitle,
                    offsetX: 100,
                    style: {
                        fontFamily: "Cairo-Bold",
                        fontSize: "24px",
                        color: this.ChartColor,
                    },
                },
                colors: [this.ChartColor],
                labels: this.ChartLabels,
            },

            areaChartSeries: [
                {
                    name: this.ChartName,
                    data: this.ChartData,
                },
            ],
            // END:: SPARKS AREA CHART DATA
        };
    },
};
</script>

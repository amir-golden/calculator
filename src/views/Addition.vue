<template>
  <div class="row">
    <div class="one-half column info">
      <div class="container info-block">
        <h4>Привет, {{ getUserName() }}!</h4>
        <h4>Текущая операция: {{ getCurrentOperation }}</h4>
      </div>
    </div>
    <div class="one-half column calculator">
      <div class="container calculator-form">
        <transition name="slide-fade">
          <div v-if="step === 1" class="step-1">
            <h5>Пожалуйста, введите целые числа:</h5>
            <div v-for="(item, index) in formObj.items" :key="item.id">
              <label>Число {{ item.id + 1 }}</label>
              <div class="calculator-form-control">
                <Input
                  :mask="numberMask"
                  :field-name="`${item.id}`"
                  :input-value="item.value"
                  placeholder="Число..."
                  @update="updateForm"
                />
                <button
                  v-if="index === formObj.items.length - 1"
                  class="button button-primary"
                  @click="addNewItem"
                >
                  Добавить ещё число
                </button>
              </div>
            </div>
          </div>
        </transition>
        <transition name="slide-fade">
          <div v-if="step === 2" class="step-2">
            <Input
              :mask="numberMask"
              :input-value="filter"
              placeholder="Фильтр по значению числа"
              @update="updateFilterValue"
            />
            <table>
              <thead>
                <tr>
                  <th v-for="tableColumn in tableColumns" :key="tableColumn.id">
                    <div class="table-header">
                      <div
                        class="table-header-name"
                        :class="{
                          'header-with-order': tableColumn.order !== null,
                        }"
                        @click="
                          tableColumn.order !== null
                            ? makeSort(tableColumn.id)
                            : null
                        "
                      >
                        {{ tableColumn.name }}
                        <div
                          v-if="
                            tableColumn.order !== '' &&
                            tableColumn.order !== null
                          "
                          class="table-order"
                          :class="{ DESC: tableColumn.order === 'DESC' }"
                        />
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in filteredRows" :key="row.id">
                  <td>Число {{ row.id + 1 }}</td>
                  <td>{{ row.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </transition>
        <transition name="slide-fade">
          <div v-if="step === 3" class="step-3">
            <h5>
              Производится расчёт...
            </h5>
          </div>
        </transition>
        <transition name="slide-fade">
          <div v-if="step === 4" class="step-4">
            <table>
              <thead>
                <tr>
                  <th v-for="tableColumn in tableColumns" :key="tableColumn.id">
                    <div class="table-header">
                      <div class="table-header-name">
                        {{ tableColumn.name }}
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="row in filteredRows"
                  :key="row.id"
                  :class="{ 'green-row': row.value > 10 }"
                >
                  <td>Число {{ row.id + 1 }}</td>
                  <td>{{ row.value }}</td>
                </tr>
                <tr>
                  <td>Результат:</td>
                  <td>
                    {{
                      formObj.items.reduce(
                        (acc, current) => acc + current.value,
                        0
                      )
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </transition>

        <div class="calculator-form-buttons">
          <button
            :disabled="step === 1 || step === 3"
            class="button button-primary"
            @click="changeStep('prev')"
          >
            {{ step === 4 ? "Вернуться к вводу данных" : "Назад" }}
          </button>
          <button
            :disabled="
              step === 3 || step === 4 || $v.formObj.items.$invalid === true
            "
            class="button button-primary"
            @click="changeStep('next')"
          >
            Продолжить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { capitalizeFirstLetter } from "../common";
import Input from "../components/Input";

export default {
  name: "Addition",
  components: {
    Input,
  },
  mixins: [validationMixin],
  data() {
    return {
      step: 1,
      formObj: {
        items: [
          {
            id: 0,
            value: "",
          },
          {
            id: 1,
            value: "",
          },
        ],
      },
      numberMask: {
        mask: Number,
        signed: false,
        scale: 0,
        nullOnEmpty: true,
      },
      tableColumns: [
        { id: "numberColumn", name: "Номер числа", order: null },
        { id: "valueColumn", name: "Значение", order: "" },
      ],
      filter: null,
    };
  },
  validations: {
    formObj: {
      items: {
        required,
        $each: {
          value: {
            required,
          },
        },
      },
    },
  },
  computed: {
    ...mapState(["receivedUser"]),
    getCurrentOperation() {
      if (this.step === 1) {
        return "Ввод данных";
      } else if (this.step === 2) {
        return "Подтверждение данных";
      } else if (this.step === 3) {
        return "Расчет";
      } else if (this.step === 4) {
        return "Результат";
      } else {
        return "";
      }
    },
    filteredRows() {
      return this.formObj.items.filter((row) => {
        if (this.filter !== null) {
          return (row.value + "").includes(this.filter);
        }

        return row;
      });
    },
  },
  mounted() {
    document.title = this.getCurrentOperation;
  },
  methods: {
    getUserName() {
      if (typeof this.receivedUser.email === "string") {
        const regex = /(.+@.)(.+?)(\.com)/;
        const matches = this.receivedUser.email.match(regex);
        return capitalizeFirstLetter(this.receivedUser.email).replace(
          regex,
          "$1" + "*".repeat(matches[2].length) + "$3"
        );
      }
    },
    changeStep(direction) {
      switch (direction) {
        case "prev":
          this.tableColumns = [
            { id: "numberColumn", name: "Номер числа", order: null },
            { id: "valueColumn", name: "Значение", order: "" },
          ];

          this.$set(this.formObj, "items", [
            {
              id: 0,
              value: "",
            },
            {
              id: 1,
              value: "",
            },
          ]);

          this.step = 1;

          break;
        case "next":
          this.step++;

          if (this.step === 3) {
            setTimeout(() => {
              this.step++;
              document.title = this.getCurrentOperation;
            }, 5000);
          }

          break;
      }

      document.title = this.getCurrentOperation;
      this.filter = "";
    },
    addNewItem() {
      const list = this.formObj.items;

      list.push({
        value: "",
        id: list.reduce((a, b) => (a.id > b.id ? a : b)).id + 1,
      });
    },
    updateForm({ fieldName, newValue }) {
      const id = parseInt(fieldName);
      const list = this.formObj.items;
      const index = list.findIndex((item) => item.id === id);

      this.$set(this.formObj, "items", [
        ...list.slice(0, index),
        { id: id, value: newValue },
        ...list.slice(index + 1),
      ]);
    },
    updateFilterValue({ newValue }) {
      this.filter = newValue;
    },
    makeSort(tableColumnId) {
      const list = this.tableColumns;
      const index = list.findIndex((item) => item.id === tableColumnId);
      const oldObject = this.tableColumns[index];
      let newOrdering = "";

      switch (oldObject.order) {
        case "":
          newOrdering = "ASC";
          if (tableColumnId === "valueColumn") {
            this.$set(
              this.formObj,
              "items",
              this.formObj.items.sort(function (a, b) {
                return a.value - b.value;
              })
            );
          }
          break;
        case "ASC":
          newOrdering = "DESC";
          if (tableColumnId === "valueColumn") {
            this.$set(
              this.formObj,
              "items",
              this.formObj.items.sort(function (a, b) {
                return b.value - a.value;
              })
            );
          }
          break;
        case "DESC":
          if (tableColumnId === "valueColumn") {
            this.$set(
              this.formObj,
              "items",
              this.formObj.items.sort(function (a, b) {
                return a.id - b.id;
              })
            );
          }
      }

      this.tableColumns = [
        ...list.slice(0, index),
        { ...oldObject, order: newOrdering },
        ...list.slice(index + 1),
      ];
    },
  },
};
</script>

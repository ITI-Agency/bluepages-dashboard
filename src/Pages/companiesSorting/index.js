import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { Icon } from "@mui/material";
import { Button, Form, Select, Switch, Table } from "antd";

import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
import { MenuOutlined } from "@ant-design/icons";
import { arrayMoveImmutable } from "array-move";
import { useEffect, useState } from "react";
import CompaniesServices from "Services/CompaniesServices";
import { toast } from "react-toastify";
import CitiesServices from "Services/CitiesServices";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const DragHandle = SortableHandle(() => (
  <MenuOutlined style={{ cursor: "grab", color: "#999" }} />
));
const columns = [
  {
    title: "Sort",
    dataIndex: "sort",
    width: 30,
    className: "drag-visible",
    render: () => <DragHandle />,
  },
  {
    title: "Index",
    dataIndex: "index",
    className: "drag-visible",
  },
  {
    title: "ID",
    dataIndex: "id",
    className: "drag-visible",
  },
  {
    title: "Name",
    dataIndex: "name",
    className: "drag-visible",
  },
  {
    title: "City",
    dataIndex: "city",
  },
  {
    title: "Plan",
    dataIndex: "plan",
  },
];
const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    index: 0,
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    index: 1,
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    index: 2,
  },
];
const SortableItem = SortableElement((props) => <tr {...props} />);
const SortableBody = SortableContainer((props) => <tbody {...props} />);

const extractCompanies = (companies) => {
  return companies.map((company, index) => {
    return {
      key: company.id,
      id: company.id,
      name: company.name_ar,
      city: company?.city?.name_ar,
      plan: company?.plan?.name_ar,
      index: index + 1,
    };
  });
};

function CompaniesSorting() {
  const [dataSource, setDataSource] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [form] = Form.useForm();
  const [type, setType] = useState("sorting");
  const [cities, setCities] = useState([]);
  const [cityId, setCityId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    getAllCompanies(type);
  }, []);
  const getAllCompanies = async (type, cityId = null) => {
    setLoading(true);
    try {
      const filter = [
        { country: "true" },
        { city: "true" },
        { limit: 100 },
        { page: 1 },
        { sortable: "true" },
        { [type]: "true" },
      ];
      if (cityId) {
        filter.push({ cityId });
        filter.push({ packageId: 6 });
      } else {
        filter.push({ packageId: 3 });
      }

      const { status: sortedCompaniesStatus, data: sortedCompaniesData } =
        await CompaniesServices.getSortedCompanies(filter);
      const { status: citiesStatus, data: citiesData } =
        await CitiesServices.getAllCities();
      if (sortedCompaniesStatus == 200 && citiesStatus == 200) {
        // setLoading(false);
        console.log(
          "🚀 ~ file: index.js:85 ~ getAllCompanies ~ sortedCompaniesData:",
          sortedCompaniesData.length
        );
        setDataSource(extractCompanies(sortedCompaniesData));
        setCompanies(extractCompanies(sortedCompaniesData));
        setCities(citiesData);
        setLoading(false);
      } else {
        toast.error("sorry something went wrong while getting companies!");
        setLoading(false);

        // setLoading(false);
      }
    } catch (error) {
      toast.error("sorry something went wrong while getting companies!");
      setLoading(false);
      // setLoading(false);
    }
  };
  const onTypeChange = (type) => {
    console.log("🚀 ~ file: index.js:135 ~ onTypeChange ~ type:", type);
    if (type === "sorting") {
      setCityId(null);
      form.resetFields(["cityId"]);
      getAllCompanies("sorting");
    } else {
      setLoading(true);
    }
    setType(() => type);
  };
  const handleCityChange = (cityId) => {
    console.log("🚀 ~ file: index.js:135 ~ onTypeChange ~ type:", cityId);
    setCityId(() => cityId);
    if (cityId && type === "city_sorting") {
      getAllCompanies(type, cityId);
    } else {
      setDataSource(companies);
    }
  };
  const handleSubmitSorting = async () => {
    setIsSubmitting(true);
    try {
      const { status, data } = await CompaniesServices.updateCompaniesSorting({
        type,
        sorting: dataSource,
      });
      if (status === 200 || status === 201) {
        toast.success("Companies Sorted Successfully");
        setIsSubmitting(false);
      } else {
        toast.error("sorry something went wrong while sorting companies!");
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("sorry something went wrong while sorting companies!");
      setIsSubmitting(false);
    }
  };
  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(
        [].concat(dataSource),
        oldIndex,
        newIndex
      ).filter((el) => !!el);
      console.log("Sorted items: ", newData);
      setDataSource(
        newData.map((item, index) => ({ ...item, index: index + 1 }))
      );
    }
  };

  const DraggableContainer = (props) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex(
      (x) => x.index === restProps["data-row-key"]
    );
    return <SortableItem index={index} {...restProps} />;
  };
  const initialValues = {
    type: "sorting",
    cityId: null,
  };
  return (
    <DashboardLayout>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 4, md: 5 } }}
      >
        <Form
          initialValues={initialValues}
          {...layout}
          name="control-hooks"
          form={form}
        >
          {/* <MDBox sx={style}> */}
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                <Select placeholder="Select a Type" onChange={onTypeChange}>
                  <Option value="sorting" key="1">
                    All
                  </Option>
                  <Option value="city_sorting" key="1">
                    City
                  </Option>
                </Select>
              </Form.Item>
            </Grid>
            {type === "city_sorting" ? (
              <Grid item xs={12} sm={6}>
                <Form.Item name="cityId" label="City">
                  <Select
                    placeholder="Select a City"
                    allowClear
                    onChange={handleCityChange}
                  >
                    {cities?.map((city) => (
                      <Option value={city.id} key={city.id}>
                        {city.name_ar}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Grid>
            ) : null}
          </Grid>
          {/* </MDBox> */}
        </Form>
      </Paper>
      {dataSource?.length === 0 || loading ? (
        <div>No Data Yet...</div>
      ) : (
        <>
          <MDBox className="flex my-2 flex-end">
            <Button
              className={`h-full text-white hover:text-white rounded-lg bg-blue-700 hover:bg-blue-600  flex items-center text-[16px] font-semibold ${
                isSubmitting
                  ? "bg-blue-400 text-white"
                  : "bg-blue-700 text-white"
              }`}
              loading={isSubmitting}
              onClick={handleSubmitSorting}
            >
              {/* <div className="flex items-center text-[16px] font-semibold"> */}
              <Icon>edit</Icon>Save Sorting
              {/* </div> */}
            </Button>
          </MDBox>
          <Table
            pagination={false}
            dataSource={dataSource}
            columns={columns}
            rowKey="index"
            components={{
              body: {
                wrapper: DraggableContainer,
                row: DraggableBodyRow,
              },
            }}
          />
        </>
      )}
    </DashboardLayout>
  );
}

export default CompaniesSorting;

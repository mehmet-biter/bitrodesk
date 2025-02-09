import type { GetServerSideProps, NextPage } from "next";
import ProfileSidebar from "layout/profile-sidebar";
import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import countries from "lib/values/country.json";
import { useDispatch, useSelector } from "react-redux";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { RootState } from "state/store";
import { Formik, Field, Form } from "formik";
import { UpdateUserInfoByTokenAction } from "state/actions/user";
import useTranslation from "next-translate/useTranslation";
import { customPage, landingPage } from "service/landing-page";
import Footer from "components/common/footer";
import { toast } from "react-toastify";
const Edit: NextPage = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const uploadFile = (e: any) => {
    const file = e.target.files[0];
    if (file.size > 2 * 1024 * 1024) {
      toast.error(t("File size must be less than 2MB"));
      return;
    }
    const formdata = new FormData();
    formdata.append("photo", file);
    formdata.append("first_name", user.first_name);
    formdata.append("last_name", user.last_name);
    formdata.append("nickname", user.nickname);
    formdata.append("email", user.email);
    formdata.append("country", user.country);
    formdata.append("gender", user.gender);
    formdata.append("phone", user.phone);
    dispatch(UpdateUserInfoByTokenAction(formdata));
  };
  return (
    <>
      <div className="page-wrap">
        <ProfileSidebar />
        <div className="page-main-content">
          <div className="container-fluid">
            <div className="section-top-wrap mb-25 inner-section-margin-top">
              <div className="profle-are-top">
                <h2 className="section-top-title">
                  {user?.first_name + " " + user?.last_name}
                </h2>
                <h3 className="user-mail">{user?.email}</h3>
              </div>
            </div>

            <div className="profile-area">
              <div className="section-wrapper">
                <div className="user-profile">
                  <div className="row">
                    <div className="col-lg-4 col-md-4 col-12">
                      <div className="user-profile-left">
                        <div className="user-thumbnail">
                          <img src={user?.photo} className="img-fluid" alt="" />
                          <div className="uplode-profile">
                            <input
                              type="file"
                              name="file"
                              id="upload-user-img"
                              onChange={(e) => uploadFile(e)}
                            />
                            <label
                              htmlFor="upload-user-img"
                              className="upload-user-img"
                            >
                              <i className="fa fa-pencil" aria-hidden="true" />
                            </label>
                          </div>
                        </div>

                        <div className="user-profile-content">
                          <h2>{user?.first_name + " " + user?.last_name}</h2>
                          <h4>{user?.email}</h4>
                        </div>
                      </div>
                    </div>
                    <Formik
                      enableReinitialize={true}
                      initialValues={{
                        first_name: user?.first_name,
                        last_name: user?.last_name,
                        nickname: user?.nickname,
                        country: user?.country,
                        gender: user?.gender,
                        phone: user?.phone,
                      }}
                      onSubmit={async (values) => {
                        dispatch(UpdateUserInfoByTokenAction(values));
                      }}
                    >
                      {({ setFieldValue }) => (
                        <div className="col-lg-8 col-md-8 col-12">
                          <div className="user-profile-form">
                            <Form>
                              <div className="row">
                                <div className="form-group col-12 col-md-6 col-lg-6">
                                  <label>{t("First Name")}</label>
                                  <Field
                                    type="text"
                                    name="first_name"
                                    className="form-control"
                                    placeholder={t("First Name")}
                                    id="first_name"
                                  />
                                </div>
                                <div className="form-group col-12 col-md-6 col-lg-6">
                                  <label>{t("Last Name")}</label>
                                  <Field
                                    type="text"
                                    name="last_name"
                                    className="form-control"
                                    placeholder={t("Last Name")}
                                    id="last_name"
                                  />
                                </div>
                                <div className="form-group col-12 col-md-6 col-lg-6">
                                  <label>{t("NickName")}</label>
                                  <Field
                                    type="text"
                                    name="nickname"
                                    className="form-control"
                                    placeholder={t("Nick Name")}
                                    id="nickname"
                                  />
                                </div>
                                <div className="form-group col-12 col-md-6 col-lg-6">
                                  <label>{t("Phone")}</label>

                                  <PhoneInput
                                    country={"us"}
                                    inputStyle={{ paddingLeft: 50 }}
                                    value={user?.phone}
                                    onChange={(phone) => {
                                      setFieldValue("phone", phone);
                                    }}
                                  />

                                  <small>
                                    {t(
                                      "Please add phone number with country phone code but not (+ sign.) Ex. for portugal 351*****"
                                    )}
                                  </small>
                                </div>
                                <div className="form-group col-12 col-md-6 col-lg-6">
                                  <label>{t("Country")}</label>
                                  <div className="cp-select-area">
                                    <Field
                                      as="select"
                                      name="country"
                                      id="country"
                                      className="form-control"
                                    >
                                      {countries.map((country: any) => (
                                        <option
                                          key={country.value}
                                          value={country.value.toUpperCase()}
                                          selected={
                                            country.value === user?.country
                                          }
                                        >
                                          {country.name}
                                        </option>
                                      ))}
                                    </Field>
                                  </div>
                                </div>
                                <div className="form-group col-12 col-md-6 col-lg-6">
                                  <label>{t("Gender")}</label>
                                  <div className="cp-select-area">
                                    <Field
                                      className="form-control"
                                      name="gender"
                                      id=""
                                      as="select"
                                    >
                                      <option
                                        selected={user?.gender === 1}
                                        value={1}
                                      >
                                        {t("Male")}
                                      </option>
                                      <option
                                        selected={user?.gender === 2}
                                        value={2}
                                      >
                                        {t("Female")}
                                      </option>
                                      <option
                                        selected={user?.gender === 3}
                                        value={3}
                                      >
                                        {t("Others")}
                                      </option>
                                    </Field>
                                  </div>
                                </div>
                              </div>
                              <button
                                type="submit"
                                className="btn nimmu-user-sibmit-button mt-5"
                              >
                                <span>{t("Update Profile")}</span>
                              </button>
                            </Form>
                          </div>
                        </div>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/user/edit-profile");
  return {
    props: {},
  };
};

export default Edit;
